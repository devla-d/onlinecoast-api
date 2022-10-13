"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_service_1 = __importDefault(require("../services/User.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendemail_service_1 = require("../services/sendemail.service");
const confirmationEmail_1 = __importDefault(require("../services/confirmationEmail"));
const path_1 = __importDefault(require("path"));
const welcomeEmail_1 = require("../services/welcomeEmail");
const resetPassword_1 = require("../services/resetPassword");
require("dotenv/config");
const SRC_DIR = path_1.default.join(__dirname, "..");
const MEDIAPATH = path_1.default.join(SRC_DIR, "public/media");
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN_PRIVATE_KEY = process.env
    .REFRESH_TOKEN_PRIVATE_KEY;
class AuthController {
    userServices;
    senDmail;
    constructor() {
        this.userServices = new User_service_1.default();
        this.senDmail = new sendemail_service_1.SendMail();
    }
    availableData = async (req, res) => {
        const users = await this.userServices.userRepository.find();
        const emails = users.map((user) => user.email);
        return res.json({ existingEmails: emails });
    };
    regisTer = async (req, res) => {
        try {
            const { email, password } = req.body;
            const passwordHash = await bcrypt_1.default.hash(password, 10);
            const payload = {
                email: email,
                password: passwordHash,
            };
            const token = jsonwebtoken_1.default.sign(payload, SECRET_KEY, {
                expiresIn: "15m",
            });
            this.senDmail.sendeMail("support@onlineseacoastacct.net", email, "welcome to onlineseacoast, confirm your email address", (0, confirmationEmail_1.default)(token));
            return res.status(200).json({ msg: "Email sent successfuly" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json("something went wrong");
        }
    };
    verifyRegisTer = async (req, res) => {
        const { token } = req.body;
        if (!token)
            return res.status(400);
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
            if (err)
                return res.json({ error: "Token Error" });
            return res.json({ user: user });
        });
    };
    createAccount = async (req, res) => {
        const body = req.body;
        if (!req.files)
            return res.status(400).json({ error: "file required" });
        let user = await this.userServices.userRepository.findOne({
            where: {
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email,
            },
        });
        if (user)
            return res.status(200).json({ user: user, msg: "created successfully" });
        var image = req.files.profile_img;
        var imageName = `/${Date.now()}-${image.name}`;
        image.mv(MEDIAPATH + imageName, async (error) => {
            if (error)
                return res.status(406).json({ error: "error uploading file" });
            const newUser = await this.userServices.createUser(body, `/media${imageName}`);
            this.senDmail.sendeMail("support@onlineseacoastacct.net", newUser.email, "welcome to onlineseacoast", (0, welcomeEmail_1.welcomEmail)(newUser.account_number, `${newUser.first_name} ${newUser.last_name}`, newUser.security_pin));
            return res
                .status(201)
                .json({ muser: newUser, msg: "created successfully" });
        });
    };
    logIN = async (req, res) => {
        const { username, password } = req.body;
        const schema = this.userServices.loginSchema();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.json({ errors: errors });
        }
        const user = await this.userServices.userRepository.findOne({
            where: { account_number: username },
        });
        if (!user)
            return res.json({ errors: "Account Number Or Password is Invalid" });
        const isMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!isMatch)
            return res.json({ errors: "Account Number Or Password is Invalid" });
        const { accessToken, refreshToken } = await this.userServices.generateTokens(user);
        return res.json({
            msg: "Sucessfuly loggin",
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    };
    forgetPassword = async (req, res) => {
        const { email } = req.body;
        const schema = this.userServices.resetPasswordSchema();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.json({ errors: errors });
        }
        const user = await this.userServices.userRepository.findOne({
            where: { email: email },
        });
        if (!user)
            return res.json({ errors: "User with this email doe's not exits" });
        const payload = {
            email: email,
            id: user.id,
        };
        const token = jsonwebtoken_1.default.sign(payload, SECRET_KEY, {
            expiresIn: "10m",
        });
        this.senDmail.sendeMail("support@onlineseacoastacct.net", user.email, "Reset your password", (0, resetPassword_1.resetPasswordtem)(token));
        return res.status(200).json({ msg: "Email sent successful" });
    };
    resetPasswordVerify = async (req, res) => {
        const { authToken } = req.body;
        if (!authToken)
            return res.status(400).json({ errors: "Token Required" });
        jsonwebtoken_1.default.verify(authToken, SECRET_KEY, (err, user) => {
            if (err)
                return res.json({ errors: "Token Error" });
            return res.status(200).json({ user: user });
        });
    };
    resetPassword = async (req, res) => {
        const { newpassword, email, id } = req.body;
        const schema = this.userServices.resetPasswordSchemaSecond();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.json({ errors: errors });
        }
        const user = await this.userServices.userRepository.findOne({
            where: { id: parseInt(id), email: email },
        });
        if (!user)
            return res.status(404).json("User Not Found");
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashPassword = bcrypt_1.default.hashSync(newpassword, salt);
        user.password = hashPassword;
        await this.userServices.userRepository.save(user);
        return res.status(200).json({ msg: "password changed" });
    };
    refreshToken = async (req, res) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken)
            return res.status(400).json({ error: "Invalid refreshToken" });
        jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_PRIVATE_KEY, (err, user) => {
            if (err)
                return res.json({ errors: "Refresh Token Expired" });
            if (user) {
                const uSer = user;
                const accesstoken = this.userServices.newAccessToken(uSer);
                res.status(200).json({ accesstoken });
            }
        });
    };
    changePassword = async (req, res) => {
        const { oldpassword, newpassword } = req.body;
        const schema = this.userServices.changePasswordSchema();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.json({ errors: errors });
        }
        const user = req.user;
        const isMatch = bcrypt_1.default.compareSync(oldpassword, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Password don/'t match" });
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashPassword = bcrypt_1.default.hashSync(newpassword, salt);
        user.password = hashPassword;
        await this.userServices.userRepository.save(user);
        return res.status(201).json({ msg: "Password changed" });
    };
    resetPin = async (req, res) => {
        console.log(req.body);
        const { newpin, oldpin } = req.body;
        const schema = this.userServices.resetPinSchema();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.json({ errors: errors });
        }
        const user = req.user;
        if (user.security_pin != oldpin.toString())
            return res.status(400).json({ error: "support don/'t match" });
        user.security_pin = newpin;
        await this.userServices.userRepository.save(user);
        return res.status(201).json({ user: user, msg: "support pin changed" });
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map