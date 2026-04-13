import asyncHandler from "../middlewares/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import config from "../config/index.js";
export const googleCallback = asyncHandler(async (req, res) => {
    const user = req.user;

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.app.isProduction,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Use URL fragment to avoid leaking access token via server logs/referrers.
    // res.redirect(`${config.oauth.frontendUrl}/oauth-success#token=${accessToken}`);
    res.json({
  success: true,
  accessToken,
});
});