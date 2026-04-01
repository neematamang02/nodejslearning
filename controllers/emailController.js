import asyncHandler from "../middlewares/asyncHandler";
import { sendResponse } from "../utils/sendResponse";

export const sendMailController = asyncHandler(async(req, res)=> {
    const { to, subject, text } = req.body;
    const isSent = await sendEmail(to, subject, text);
    sendResponse(res, {
        statusCode: 200,
        message: "Email sent successfully",
        data: { isSent }
    });
});
