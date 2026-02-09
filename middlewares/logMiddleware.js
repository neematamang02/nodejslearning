import { pinoHttp } from "pino-http";
import { randomUUID } from "crypto";
import logger from "../utils/logger.js";

export const logMiddleware = pinoHttp({
    logger,
    
    // Better request ID generation
    genReqId: (req, res) => {
        const existingId = req.id ?? req.headers['x-request-id'];
        if (existingId) return existingId;
        const id = randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
    },
    
    // Custom log level based on response - FIXED
    customLogLevel: function (req, res, err) {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        if (res.statusCode >= 300) return 'silent'; // Don't log redirects
        return 'info'; // 200-299 = info (success)
    },

    // Custom success message
    customSuccessMessage: function (req, res) {
        return `${req.method} ${req.url} completed`;
    },

    // Custom error message
    customErrorMessage: function (req, res, err) {
        return `${req.method} ${req.url} failed: ${err.message}`;
    },
    
    // Custom attribute keys
    customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
        responseTime: 'duration'
    },
    
    // Add custom properties to logs
    customProps: (req, res) => ({
        userId: req.user?.id || null,
        userAgent: req.headers['user-agent'],
    }),
});