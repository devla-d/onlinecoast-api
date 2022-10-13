"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_service_1 = require("../services/error.service");
/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
function handleError(err, req, res, next) {
    let customError = err;
    if (!(err instanceof error_service_1.CustomError)) {
        customError = new error_service_1.CustomError(err.message);
    }
    res.status(customError.status).send(customError);
}
exports.default = handleError;
//# sourceMappingURL=error-handler.middleware.js.map