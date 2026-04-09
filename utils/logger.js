import { pino } from "pino";
import config from "../config/index.js";

const logger = pino({
    level: config.logging.level || (config.app.isProduction ? "info" : "debug"),
    base: {
        env: config.app.env,
        revision: config.logging.revision || undefined
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token', 'accessToken', 'refreshToken'],
        censor: '[REDACTED]'
    },
    transport: !config.app.isProduction ? {
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