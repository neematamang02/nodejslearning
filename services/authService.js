import User from "../models/userModel.js";
import { Createuser, deleteuser, finduserbyemail, finduserbyId, listuser, updateuser } from "../repositories/userRepository.js"
import ApiError from "../utils/ApiError.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import logger from "../utils/logger.js";
import redisClient from "../config/redis.js";
import sendEmail from "./emailService.js";
import bcrypt from "bcryptjs";


export const saveOtp = async (email, otp) => {
    const hashOtp = await bcrypt.hash(otp.toString(), 10);
  await redisClient.setEx(`otp:${email}`, 300, hashOtp); // 5 min expiry
};

export const savePendingRegistration = async (email, userData) => {
    // Store user data with 5 min expiry (same as OTP)
    await redisClient.setEx(`registration:${email}`, 300, JSON.stringify(userData));
};

export const getPendingRegistration = async (email) => {
    const data = await redisClient.get(`registration:${email}`);
    if (!data) {
        return null;
    }
    return JSON.parse(data);
};

export const deletePendingRegistration = async (email) => {
    await redisClient.del(`registration:${email}`);
};

export const verifyOtp = async (email, otp) => {
  const storedhashedOtp = await redisClient.get(`otp:${email}`);

  if (!storedhashedOtp) {
    throw new Error("OTP expired or not found");
  }
  const isMatch = await bcrypt.compare(otp.toString(), storedhashedOtp);
    if (!isMatch) {
    throw new Error("Invalid OTP");
  }

  // delete after success
  await redisClient.del(`otp:${email}`);

  return true;
};



export const registerService = async (userdata) => {
    const existinguser = await finduserbyemail(userdata.email);
    if (existinguser) {
        logger.warn({ email: userdata.email }, "Registration attempt with existing email");
        throw new ApiError("User already exists",409, "User_already_exists");
    }
    const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store user data in Redis temporarily
    await savePendingRegistration(userdata.email, {
        name: userdata.name,
        password: userdata.password
    });
    
    await saveOtp(userdata.email, generateOtp);
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
    
    // Get pending registration data from Redis
    const pendingData = await getPendingRegistration(email);
    if (!pendingData) {
        throw new ApiError("Registration session expired or not found", 400, "REGISTRATION_EXPIRED");
    }
    
    // Create user with all required fields
    const newUser = await Createuser({
        name: pendingData.name,
        email: pendingData.email,
        password: pendingData.password
    });
    
    // Clean up pending data from Redis
    await deletePendingRegistration(email);
    
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