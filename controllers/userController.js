import asyncHandler from "../middlewares/asyncHandler.js";
import { deleteuserservice, finduserbyidservice, Listuserservice, userupdateservice } from "../services/authService.js";
import { sendResponse } from "../utils/sendResponse.js";

export const getUser = asyncHandler(async (req, res) => {
    const { users, pagination } = await Listuserservice(req.query);
    sendResponse(res, {
        statusCode: 200,
        message: "Users reterived successfully",
        data: { users },
        meta: { pagination },
    });
});

export const testing = asyncHandler(async (_req, res) => {
    sendResponse(res, 200, "Welcome admin");
});

export const getUserbyid = asyncHandler(async (req, res) => {
    const user = await finduserbyidservice(req.params.id);
    sendResponse(res, {
  statusCode: 200,
  message: "User retrieved successfully",
  data: user,
});
});

export const getMyProfile = asyncHandler(async (req, res) => {
    const user = await finduserbyidservice(req.user._id);
    sendResponse(res, 200, "Profile retrieved successfully", user);
});

export const updatedata = asyncHandler(async (req, res) => {
    const updatedUser = await userupdateservice(req.params.id, req.body);
    sendResponse(res, {
  statusCode: 200,
  message: "User updated successfully",
  data: updatedUser,
});
});

export const updateMyProfile = asyncHandler(async (req, res) => {
    const updatedUser = await userupdateservice(req.user._id, req.body);
    sendResponse(res, 200, "Profile updated successfully", updatedUser);
});

export const deletedata = asyncHandler(async (req, res) => {
    await deleteuserservice(req.params.id);
    sendResponse(res, {
  statusCode: 200,
  message: "User deleted successfully",
});
});

export const deleteMyAccount = asyncHandler(async (req, res) => {
    await deleteuserservice(req.user._id);
    sendResponse(res, 200, "Account deleted successfully");
});

export const secretData = asyncHandler(async (_req, res) => {
    sendResponse(res, 200, "This is secret data");
});