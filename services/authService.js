import User from "../models/userModel.js";
import { Createuser, deleteuser, finduserbyemail, finduserbyId, listuser, updateuser } from "../repositories/userRepository.js"
import ApiError from "../utils/ApiError.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import logger from "../utils/logger.js";
import redisClient from "../config/redis.js";
import sendEmail from "./emailService.js";
import bcrypt from "bcryptjs";


export const saveOtp = async (email, otp) => {
    // Store OTP with user data in a single Redis key for efficiency
    const hashOtp = await bcrypt.hash(otp.toString(), 10);
    await redisClient.setEx(`registration:${email}`, 300, JSON.stringify({
        otp: hashOtp,
        userData: { email } // Store email explicitly for clarity
    }));
};

// Separate function to store user data alongside OTP
export const saveRegistrationData = async (email, userData) => {
    const existing = await redisClient.get(`registration:${email}`);
    if (existing) {
        const parsed = JSON.parse(existing);
        parsed.userData = userData;
        await redisClient.setEx(`registration:${email}`, 300, JSON.stringify(parsed));
    }
};

export const getRegistrationData = async (email) => {
    const data = await redisClient.get(`registration:${email}`);
    if (!data) {
        return null;
    }
    return JSON.parse(data);
};

export const deleteRegistrationData = async (email) => {
    await redisClient.del(`registration:${email}`);
};

export const verifyOtp = async (email, otp) => {
  const registrationData = await redisClient.get(`registration:${email}`);

  if (!registrationData) {
    throw new Error("OTP expired or not found");
  }
  
  const parsed = JSON.parse(registrationData);
  const storedhashedOtp = parsed.otp;
  
  const isMatch = await bcrypt.compare(otp.toString(), storedhashedOtp);
    if (!isMatch) {
    throw new Error("Invalid OTP");
  }

  return true;
};



export const registerService = async (userdata) => {
    const existinguser = await finduserbyemail(userdata.email);
    if (existinguser) {
        logger.warn({ email: userdata.email }, "Registration attempt with existing email");
        throw new ApiError("User already exists",409, "User_already_exists");
    }
    const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP and user data together in one Redis key
    await saveOtp(userdata.email, generateOtp);
    await saveRegistrationData(userdata.email, {
        name: userdata.name,
        password: userdata.password
    });
    
    await sendEmail(userdata.email, "Your OTP code", `Your otp code is ${generateOtp}. Expires in 5 minutes`);

    logger.info({ email: userdata.email }, "OTP sent successfully");
    return { message: "OTP sent successfully" };
}

export const otpverifyservice = async (email, otp) => {
     const isValid = await verifyOtp(email, otp);
     if (!isValid) {
        logger.warn({ email }, "Failed OTP verification");
        throw new ApiError("Invalid OTP",401, "Invalid_OTP");
    }
    
    // Get registration data from Redis (contains userData)
    const registrationData = await getRegistrationData(email);
    if (!registrationData || !registrationData.userData) {
        throw new ApiError("Registration session expired or not found", 400, "REGISTRATION_EXPIRED");
    }
    
    const { name, password } = registrationData.userData;
    
    // Create user
    const newUser = await Createuser({
        name,
        email,
        password
    });
    
    // Clean up Redis
    await deleteRegistrationData(email);
    
    logger.info({ userId: newUser._id, email }, "User registered successfully");
    return newUser;
}
const authLogger = logger.child({ module: 'auth' });

export const loginService = async (email, password) => {
    authLogger.debug({ email }, "Login attempt");
    const user = await finduserbyemail(email);
    if (!user || !(await user.matchPassword(password))) {
        authLogger.warn({ email }, "Failed login attempt");
        throw new ApiError("Invalid crentials",401, "Invalid_credentials");
    }
    authLogger.info({ userId: user._id, email }, "User logged in successfully");
    return user;
};

export const Listuserservice = async (queryString) => {
    const features = new APIFeatures(User.find(), queryString)
        .filter()
        .search(["name", "email"])
        .sort()
        .limitFields()
        .paginate();

    const { results, pagination } = await features.executeWithCount(User);
    
    return {
        users: results,
        pagination,
    };
};

export const finduserbyidservice = async (id) => {
    const user = await finduserbyId(id);
    if (!user) {
        throw new ApiError("User not found",404, "User_not_found");
    }
    return user;
};

export const userupdateservice = async (id, data) => {
    const user = await finduserbyId(id);
    if (!user) {
        throw new ApiError("User not found",404, "User_not_found");
    }
    delete data.role;
    const updatedUser = await updateuser(id, data);
    return updatedUser;
};

export const deleteuserservice = async (id) => {
    const user = await finduserbyId(id);
    if (!user) {
        throw new ApiError("User not found",404, "User_not_found");
    }
    await deleteuser(id);
}