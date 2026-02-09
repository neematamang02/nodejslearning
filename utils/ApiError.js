class ApiError extends Error {
    constructor( message, statusCode=500, code = null, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code || this.getDefaultCode(statusCode);
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    getDefaultCode(statusCode) {
        const codes = {
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            409: "CONFLICT",
            422: "VALIDATION_ERROR",
            500: "INTERNAL_SERVER_ERROR",
        };
        return codes[statusCode] || "SERVER_ERROR";
    }
}
export default ApiError;