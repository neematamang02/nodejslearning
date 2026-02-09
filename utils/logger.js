import { pino } from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
    base: {
        env: process.env.NODE_ENV,
        revision: process.env.GIT_COMMIT || undefined
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token', 'accessToken', 'refreshToken'],
        censor: '[REDACTED]'
    },
    transport: process.env.NODE_ENV !== "production" ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' }
    } : undefined,
    serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
    },
});

export default logger;