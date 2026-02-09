import User from "../models/userModel.js";
import { Createuser, deleteuser, finduserbyemail, finduserbyId, listuser, updateuser } from "../repositories/userRepository.js"
import ApiError from "../utils/ApiError.js";
import { APIFeatures } from "../utils/apiFeatures.js";
import logger from "../utils/logger.js";


export const registerService = async (userdata) => {
    const existinguser = await finduserbyemail(userdata.email);
    if (existinguser) {
        logger.warn({ email: userdata.email }, "Registration attempt with existing email");
        throw new ApiError("User already exists",409, "User_already_exists");
    }
    const newuser = await Createuser(userdata);
    logger.info({ userId: newuser._id, email: newuser.email }, "New user registered");
    return newuser;
}
const authLogger = logger.child({ module: 'auth' });

export const loginService = async (email, password) => {
    authLogger.debug({ email }, "Login attempt");
    const user = await finduserbyemail(email);
    if (!user || !(await user.matchPassword(password))) {
        logger.warn({ email }, "Failed login attempt");
        throw new ApiError("Invalid crentials",401, "Invalid_credentials");
    }
    logger.info({ userId: user._id, email }, "User logged in successfully");
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