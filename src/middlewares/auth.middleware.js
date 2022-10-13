"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleWare = void 0;
const User_service_1 = __importDefault(require("../services/User.service"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_entity_1 = require("../entity/User.entity");
const SECRET_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY;
class AuthMiddleWare {
    userServices;
    constructor() {
        this.userServices = new User_service_1.default();
    }
    authRequired = (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null)
            return res.sendStatus(401);
        jsonwebtoken_1.default.verify(token, SECRET_KEY, async (err, user) => {
            if (err)
                return res.status(401).json({ msg: "Access Token Expired" });
            const payload = user;
            const uSer = await this.userServices.userRepository.findOne({
                where: { id: payload.id, email: payload.email },
            });
            if (!uSer)
                return res.status(400).json({ msg: "No User" });
            req.user = uSer;
            next();
        });
    };
    adminRequired = (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null)
            return res.sendStatus(401);
        jsonwebtoken_1.default.verify(token, SECRET_KEY, async (err, user) => {
            if (err)
                return res.status(401).json({ msg: "Access Token Expired" });
            const payload = user;
            const uSer = await this.userServices.userRepository.findOne({
                where: { id: payload.id, email: payload.email },
            });
            if (!uSer)
                return res.status(400).json({ msg: "No User" });
            if (uSer.roles != User_entity_1.Roles.ADMIN)
                return res.status(406).json({ msg: " User not allowed" });
            req.user = uSer;
            next();
        });
    };
    validateRegistration = async (req, res, next) => {
        const { email } = req.body;
        const schema = this.userServices.registerSchema();
        const { error } = schema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.map((e) => e.message);
            return res.json({ errors: errors });
        }
        const emailExist = await this.userServices.validatEmail(email);
        if (emailExist)
            return res.json({ error: "email already exist" });
        next();
    };
    validateCreateUser = async (req, res, next) => {
        const schema = this.userServices.createUserSchema();
        const { error } = schema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const errors = error.details.map((e) => e.message);
            return res.json({ errors: errors });
        }
        next();
    };
}
exports.AuthMiddleWare = AuthMiddleWare;
//# sourceMappingURL=auth.middleware.js.map