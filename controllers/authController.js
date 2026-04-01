import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { registerService, loginService, otpverifyservice } from "../services/authService.js";
import { sendResponse } from "../utils/sendResponse.js";
import ApiError from "../utils/ApiError.js";

export const register = asyncHandler(async (req, res) => {
    const user = await registerService(req.body);
    // sendResponse(res, 201, "User created successfully", user);
    sendResponse(res, {
        statusCode: 201,
        message: "User created successfully",
        data: { user }
    })
});
export const verifyOtp = asyncHandler(async (req, res) => {
    const user = await otpverifyservice(req.body.email, req.body.otp)
    sendResponse(res, {
        statusCode: 200,
        message: "OTP verified successfully",
        data: { user }
    });
})
export const loginUser = asyncHandler(async (req, res) => {
    const user = await loginService(req.body.email, req.body.password);
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // sendResponse(res, 200, "User logged in successfully", {
    //     user: {
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email
    //     },
    //     accessToken
    // });
    sendResponse(res, {
        statusCode: 200,
        message: "User logged in successfully",
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }, accessToken
        },
    });
});

export const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    
    if (!token) {
        throw new ApiError(401, "Refresh token not found", "REFRESH_TOKEN_MISSING");
    }
    
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    // sendResponse(res, 200, "Token refreshed successfully", { accessToken });
    sendResponse(res, {
        statusCode: 200,
        message: "Token refreshed successfully",
        data: {accessToken}
    })
});

export const Logoutuser = (_req, res) => {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict" });
    // sendResponse(res, 200, "Logged out successfully");
    sendResponse(res, {
        statusCode: 200,
        message: "Logged out successfully",
    })
};