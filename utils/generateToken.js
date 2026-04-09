import jwt from "jsonwebtoken";
import config from "../config/index.js";
export const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, tokenVersion: user.tokenVersion }, config.auth.jwtAccessSecret, {
        expiresIn: config.auth.accessTokenExp,
    });
};
export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, tokenVersion: user.tokenVersion }, config.auth.jwtRefreshSecret, {
        expiresIn: config.auth.refreshTokenExp,
    });
};