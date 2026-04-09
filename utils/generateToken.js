import jwt from "jsonwebtoken";
import config from "../config/index.js";
export const generateAccessToken = (id) => {
    return jwt.sign({ id }, config.auth.jwtAccessSecret, {
        expiresIn: config.auth.accessTokenExp,
    });
};
export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, config.auth.jwtRefreshSecret, {
        expiresIn: config.auth.refreshTokenExp,
    });
};
