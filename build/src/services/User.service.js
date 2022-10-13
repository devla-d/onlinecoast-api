"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const db_config_1 = require("../config/db.config");
const User_entity_1 = require("../entity/User.entity");
const dotenv = __importStar(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Authtoken_entity_1 = __importDefault(require("../entity/Authtoken.entity"));
const Transaction_entity_1 = __importStar(require("../entity/Transaction.entity"));
const Cards_entity_1 = __importDefault(require("../entity/Cards.entity"));
const moment_1 = __importDefault(require("moment"));
const sendemail_service_1 = require("./sendemail.service");
const topUpnotify_1 = __importDefault(require("./topUpnotify"));
dotenv.config();
const ACCESS_TOKEN_PRIVATE_KEY = process.env
    .ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_TOKEN_PRIVATE_KEY = process.env
    .REFRESH_TOKEN_PRIVATE_KEY;
class UserServices {
    passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
    userRepository = db_config_1.AppDataSource.getRepository(User_entity_1.User);
    tokenRepository = db_config_1.AppDataSource.getRepository(Authtoken_entity_1.default);
    txtRepository = db_config_1.AppDataSource.getRepository(Transaction_entity_1.default);
    cardRepository = db_config_1.AppDataSource.getRepository(Cards_entity_1.default);
    senDmail = new sendemail_service_1.SendMail();
    registerSchema = () => {
        return joi_1.default.object().keys({
            email: joi_1.default.string().min(3).max(50).email().required(),
            password: joi_1.default.string().pattern(this.passwordRules).messages({
                "string.pattern.base": "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
            }),
        });
    };
    validatEmail = async (email) => {
        try {
            const user = await this.userRepository.findOne({
                where: { email: email },
            });
            if (user) {
                return true;
            }
            return false;
        }
        catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    };
    createUser = async (data, img) => {
        const newUser = new User_entity_1.User();
        newUser.account_type = data.account_type;
        newUser.city = data.city;
        newUser.country = data.country;
        newUser.date_of_birth = data.date_of_birth;
        newUser.email = data.email;
        newUser.first_name = data.first_name;
        newUser.gender = data.gender;
        newUser.profile_img = img;
        newUser.last_name = data.last_name;
        newUser.password = data.password;
        newUser.zipcode = data.zipcode;
        newUser.street_name = data.street_name;
        newUser.security_pin = data.security_pin;
        newUser.state = data.state;
        newUser.phone_number = data.phone_number;
        newUser.next_of_kin = data.next_of_kin;
        newUser.account_number = Math.random().toString().slice(2, 12);
        await this.userRepository.save(newUser);
        await this.createNewUserCard(newUser);
        return newUser;
    };
    createNewUserCard = async (user) => {
        const d2 = new Date("2025");
        const newCard = new Cards_entity_1.default();
        newCard.user = user;
        newCard.billing_address = `${user.street_name},${user.city}`;
        newCard.card_number = `5${Math.random().toString().slice(2, 17.8)}`;
        newCard.card_cvv = Math.random().toString().slice(2, 5);
        newCard.card_name = user.first_name + " " + user.last_name;
        newCard.card_type = "Master Card";
        newCard.zipcode = user.zipcode;
        newCard.expire = (0, moment_1.default)(d2).format("MM/YY");
        await this.cardRepository.save(newCard);
        return newCard;
    };
    createUserSchema = () => {
        return joi_1.default.object().keys({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required(),
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            phone_number: joi_1.default.string().required(),
            date_of_birth: joi_1.default.string().required(),
            gender: joi_1.default.string().required(),
            next_of_kin: joi_1.default.string().required(),
            street_name: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            state: joi_1.default.string().required(),
            country: joi_1.default.string().required(),
            zipcode: joi_1.default.string().required(),
            security_pin: joi_1.default.string().required(),
            account_type: joi_1.default.string().required(),
            profile_img: joi_1.default.string(),
            iat: joi_1.default.string(),
            exp: joi_1.default.string(),
        });
    };
    generateTokens = async (user) => {
        try {
            const payload = {
                id: user.id,
                email: user.email,
            };
            const accessToken = jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
                expiresIn: "15m",
            });
            const refreshToken = jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_PRIVATE_KEY, {
                expiresIn: "1d",
            });
            const authToken = await this.tokenRepository.findOne({
                where: { user: { id: user.id } },
            });
            if (!authToken) {
                const newToken = new Authtoken_entity_1.default();
                newToken.user = user;
                newToken.refreshToken = refreshToken;
                await this.tokenRepository.save(newToken);
            }
            else {
                authToken.refreshToken = refreshToken;
                await this.tokenRepository.save(authToken);
            }
            return Promise.resolve({ accessToken, refreshToken });
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    };
    newAccessToken = (user) => {
        const payload = {
            id: user.id,
            role: user.roles,
            email: user.email,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "15m",
        });
        return accessToken;
    };
    loginSchema = () => {
        return joi_1.default.object().keys({
            username: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
        });
    };
    resetPasswordSchema = () => {
        return joi_1.default.object().keys({
            email: joi_1.default.string().email().required(),
        });
    };
    resetPasswordSchemaSecond = () => {
        return joi_1.default.object().keys({
            newpassword: joi_1.default.string().pattern(this.passwordRules).messages({
                "string.pattern.base": "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
            }),
            confirmnewpassword: joi_1.default.string().pattern(this.passwordRules).messages({
                "string.pattern.base": "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
            }),
            id: joi_1.default.number().required(),
            email: joi_1.default.string().email().required(),
            iat: joi_1.default.number(),
            exp: joi_1.default.number(),
        });
    };
    tracSactionSameSchema = () => {
        return joi_1.default.object().keys({
            amount: joi_1.default.number().required(),
            account_number: joi_1.default.string().required(),
            purpose: joi_1.default.string().optional().allow(""),
            beneficiary: joi_1.default.string().required(),
        });
    };
    tracSactionOtherSchema = () => {
        return joi_1.default.object().keys({
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            phone: joi_1.default.string().optional().allow(""),
            email: joi_1.default.string().email().optional().allow(""),
            ben_account_number: joi_1.default.string().required(),
            iban_number: joi_1.default.string().required(),
            bank_name: joi_1.default.string().required(),
            swift_code: joi_1.default.string().required(),
            amount: joi_1.default.number().required(),
            purpose: joi_1.default.string().optional().allow(""),
        });
    };
    tracSactionInterSchema = () => {
        return joi_1.default.object().keys({
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            city: joi_1.default.string().optional().allow(""),
            country: joi_1.default.string().optional().allow(""),
            ben_account_number: joi_1.default.string().required(),
            iban_number: joi_1.default.string().required(),
            bank_name: joi_1.default.string().required(),
            swift_code: joi_1.default.string().required(),
            amount: joi_1.default.number().required(),
            purpose: joi_1.default.string().optional().allow(""),
        });
    };
    getUserTransactions = async (user, limit) => {
        if (limit) {
            const [txt] = await this.txtRepository.findAndCount({
                where: { user: { id: user.id } },
                take: limit,
                order: {
                    createdAt: "DESC",
                },
            });
            return txt;
        }
        else {
            // const txt = await this.txtRepository.find({
            //   where: { user: { id: user.id } },order:,
            // });
            const txt = await this.txtRepository
                .createQueryBuilder("transaction")
                .where("transaction.user.id = :id", { id: user.id })
                .orderBy("createdAt", "DESC")
                .getMany();
            return txt;
        }
    };
    /**
     * create transaction entity for the same bank
     *
     * @param user
     * @param mode
     * @param param2
     * @param status
     * @returns
     */
    createSametrans = async (user, mode, { amount, account_number, purpose, beneficiary }, status, reciever) => {
        const newTransaction = new Transaction_entity_1.default();
        newTransaction.amount = amount;
        newTransaction.benneficiary_accnumber = account_number;
        newTransaction.purpose = purpose;
        newTransaction.benneficiary_name = beneficiary;
        newTransaction.user = user;
        newTransaction.mode = mode;
        newTransaction.status = status;
        newTransaction.invoiceRef = this.makeid(10);
        if (mode == "send" && reciever) {
            user.balance = Number(user.balance) - Number(amount);
            newTransaction.reciever_id = reciever.id;
            let context = {
                first_name: user.first_name,
                last_name: user.last_name,
                invoiceRef: newTransaction.invoiceRef,
                amount: newTransaction.amount,
                createdAt: newTransaction.createdAt,
            };
            this.senDmail.sendeMail("samuelaniekan680@gmail.com", user.email, "Account Debited", (0, topUpnotify_1.default)(context, "Debited"));
        }
        // if (mode == "recieve" && status == STATUS.SUCCESS) {
        //   user.balance = Number(user.balance) + Number(amount);
        // }
        await this.userRepository.save(user);
        await this.txtRepository.save(newTransaction);
        return newTransaction;
    };
    /**
     * create transaction entity for other banks
     *
     * @param user
     * @param body
     * @param status
     * @returns
     */
    createOthertrans = async (user, body, status) => {
        const newTransaction = new Transaction_entity_1.default();
        newTransaction.amount = body.amount;
        newTransaction.benneficiary_accnumber = body.iban_number;
        newTransaction.purpose = body.purpose;
        newTransaction.benneficiary_name = body.first_name + " " + body.last_name;
        newTransaction.user = user;
        newTransaction.mode = "send";
        newTransaction.status = status;
        newTransaction.invoiceRef = this.makeid(10);
        if (status == Transaction_entity_1.STATUS.PENDING) {
            user.balance = Number(user.balance) - Number(body.amount);
        }
        await this.userRepository.save(user);
        await this.txtRepository.save(newTransaction);
        return newTransaction;
    };
    /**
     * create transaction entity for international banks
     *
     * @param user
     * @param body
     * @param status
     * @returns
     */
    createIntertrans = async (user, body, status) => {
        const newTransaction = new Transaction_entity_1.default();
        newTransaction.amount = body.amount;
        newTransaction.benneficiary_accnumber = body.iban_number;
        newTransaction.purpose = body.purpose;
        newTransaction.benneficiary_name = body.first_name + " " + body.last_name;
        newTransaction.user = user;
        newTransaction.mode = "send";
        newTransaction.status = status;
        newTransaction.invoiceRef = this.makeid(10);
        if (status == Transaction_entity_1.STATUS.PENDING) {
            user.balance = Number(user.balance) - Number(body.amount);
        }
        await this.userRepository.save(user);
        await this.txtRepository.save(newTransaction);
        return newTransaction;
    };
    changePasswordSchema = () => {
        return joi_1.default.object().keys({
            oldpassword: joi_1.default.string().required(),
            newpassword: joi_1.default.string().pattern(this.passwordRules).messages({
                "string.pattern.base": "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
            }),
            confirmnewpassword: joi_1.default.string().pattern(this.passwordRules).messages({
                "string.pattern.base": "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
            }),
        });
    };
    resetPinSchema = () => {
        return joi_1.default.object().keys({
            oldpin: joi_1.default.string().min(4).max(4).required(),
            newpin: joi_1.default.string().min(4).max(4).required(),
        });
    };
    makeid(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    topupSchema = () => {
        return joi_1.default.object().keys({
            amount: joi_1.default.number().required(),
            id: joi_1.default.number().required(),
        });
    };
}
exports.default = UserServices;
//# sourceMappingURL=User.service.js.map