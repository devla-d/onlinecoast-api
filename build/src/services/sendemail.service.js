"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMail = void 0;
const mailer_config_1 = __importDefault(require("../config/mailer.config"));
class SendMail {
    sendeMail = (fromMail, toMail, subject, body) => {
        mailer_config_1.default
            .sendMail({
            from: fromMail,
            to: toMail,
            subject,
            html: body,
        })
            .catch((err) => console.log(err));
    };
}
exports.SendMail = SendMail;
//# sourceMappingURL=sendemail.service.js.map