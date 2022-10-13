"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError {
    message;
    status;
    additionalInfo;
    constructor(message, status = 500, additionalInfo = {}) {
        this.message = message;
        this.status = status;
        this.additionalInfo = additionalInfo;
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=error.service.js.map