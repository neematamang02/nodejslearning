import logger from "../utils/logger.js";
import { sendResponse } from "../utils/sendResponse.js";

export const errorMiddleware = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const logLevel = statusCode >= 500 ? 'error' : 'warn';
    // const message = err.message || "Internal Server Error";

    // const response = {
    //     success: false,
    //     message,
    //     error: {
    //         code: err.code || "SERVER_ERROR",
    //         statusCode,
    //         ...(err.details && { details: err.details }),
    //         ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    //     },
    //     meta: {
    //         timestamp: new Date().toISOString(),
    //     },
    // };

    // res.status(statusCode).json(response);
    logger[logLevel]({
        err,
        reqId: req.id || null,
        url: req.originalUrl,
        method: req.method,
        statusCode,
        code: err.code || "SERVER_ERROR",
        userId: req.user?.id || null,
        details: err.details || null,
    }, err.message || "Request failed");
    sendResponse(res, {
        statusCode,
        message: err.message || "Internal Server Error",
        error: {
            code: err.code || "SERVER_ERROR",
            statusCode,
            details: err.details || null,
            ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
        },
    });
};