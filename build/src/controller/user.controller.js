"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const Transaction_entity_1 = require("../entity/Transaction.entity");
const User_service_1 = __importDefault(require("../services/User.service"));
class UserController {
    userServices;
    constructor() {
        this.userServices = new User_service_1.default();
    }
    dashBoard = async (req, res) => {
        const user = req.user;
        const trans = await this.userServices.getUserTransactions(user, 5);
        return res.json({ transaction: trans, msg: "" });
    };
    transactionS = async (req, res) => {
        const user = req.user;
        const trans = await this.userServices.getUserTransactions(user, undefined);
        return res.json({ transaction: trans, msg: "" });
    };
    transactionSdeTails = async (req, res) => {
        const { id } = req.params;
        const trx = await this.userServices.txtRepository.findOne({
            where: { id: parseInt(id) },
        });
        if (trx)
            return res.status(200).json({ transaction: trx });
        else
            return res.status(404).json("transaction not found");
    };
    debitCard = async (req, res) => {
        const user = req.user;
        const card = await this.userServices.cardRepository.findOne({
            where: { user: { id: user.id } },
            relations: { user: true },
        });
        return res.json({ card, msg: "" });
    };
    validateAccNumber = async (req, res) => {
        const { acc_number } = req.body;
        if (!acc_number)
            return res.status(400).json("Account number not provided");
        const user = await this.userServices.userRepository.findOne({
            where: { account_number: acc_number },
        });
        if (user)
            return res.status(202).json({
                beneficiary: `${user.first_name} ${user.last_name}`,
                valid: true,
            });
        else
            return res.json({ valid: false });
    };
    AccNumbers = async (req, res) => {
        const users = await this.userServices.userRepository.find();
        return res
            .status(200)
            .json({ accountNumbers: users.map((user) => user.account_number) });
    };
    tracSactionSame = async (req, res) => {
        const schema = this.userServices.tracSactionSameSchema();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json(errors);
        }
        const { account_number, amount } = req.body;
        const sender = req.user;
        const reciever = await this.userServices.userRepository.findOne({
            where: { account_number: account_number },
        });
        let status;
        let eRrr;
        if (!reciever)
            return res.status(404).json("user not found");
        if (sender.balance >= parseInt(amount)) {
            status = Transaction_entity_1.STATUS.PENDING;
            eRrr = false;
        }
        else {
            status = Transaction_entity_1.STATUS.DECLINED;
            eRrr = true;
        }
        const senderTxt = await this.userServices.createSametrans(sender, "send", req.body, status, reciever);
        await this.userServices.createSametrans(reciever, "recieve", req.body, status, undefined);
        return res.status(201).json({ senderTxt, error: eRrr });
    };
    tracSactionOthers = async (req, res) => {
        const schema = this.userServices.tracSactionOtherSchema();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json(errors);
        }
        let boDy = req.body;
        const user = req.user;
        let status;
        let eRrr;
        if (user.balance >= boDy.amount) {
            status = Transaction_entity_1.STATUS.PENDING;
            eRrr = false;
        }
        else {
            status = Transaction_entity_1.STATUS.DECLINED;
            eRrr = true;
        }
        const senderTxt = await this.userServices.createOthertrans(user, boDy, status);
        return res.status(201).json({ senderTxt, error: eRrr });
    };
    tracSactionInter = async (req, res) => {
        const schema = this.userServices.tracSactionInterSchema();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json(errors);
        }
        let boDy = req.body;
        const user = req.user;
        let status;
        let eRrr;
        if (user.balance >= boDy.amount) {
            status = Transaction_entity_1.STATUS.PENDING;
            eRrr = false;
        }
        else {
            status = Transaction_entity_1.STATUS.DECLINED;
            eRrr = true;
        }
        const senderTxt = await this.userServices.createIntertrans(user, boDy, status);
        return res.status(201).json({ senderTxt, error: eRrr });
    };
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map