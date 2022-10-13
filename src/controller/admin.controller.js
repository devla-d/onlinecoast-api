"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_entity_1 = require("../entity/Transaction.entity");
const sendemail_service_1 = require("../services/sendemail.service");
const topUpnotify_1 = __importDefault(require("../services/topUpnotify"));
const User_service_1 = __importDefault(require("../services/User.service"));
class AdminController {
    userServices;
    senDmail;
    constructor() {
        this.userServices = new User_service_1.default();
        this.senDmail = new sendemail_service_1.SendMail();
    }
    dashbaord = async (req, res) => {
        const [, trxCount] = await this.userServices.txtRepository.findAndCount();
        const [user, userCount] = await this.userServices.userRepository.findAndCount();
        const [, completTrxCount] = await this.userServices.txtRepository.findAndCount({
            where: { status: Transaction_entity_1.STATUS.SUCCESS },
        });
        const [, pendingTrxCount] = await this.userServices.txtRepository.findAndCount({
            where: { status: Transaction_entity_1.STATUS.PENDING },
        });
        let totalBalance = 0;
        user.forEach((us) => {
            totalBalance = Number(totalBalance) + Number(us.balance);
        });
        return res.json({
            trxCount,
            userCount,
            completTrxCount,
            pendingTrxCount,
            totalBalance,
        });
    };
    allUsers = async (req, res) => {
        const [user, userCount] = await this.userServices.userRepository.findAndCount();
        return res.json({ user });
    };
    singleUser = async (req, res) => {
        try {
            const { id } = req.params;
            let userId = parseInt(id);
            const user = await this.userServices.userRepository.findOne({
                where: { id: userId },
            });
            if (!user)
                return res.status(404).json("User not found");
            let totalSent = 0;
            let totalRecieved = 0;
            const trx = await this.userServices.txtRepository.find({
                where: { user: { id: user.id } },
            });
            trx.forEach((t) => {
                if (t.mode === "send")
                    totalSent += +t.amount;
                else
                    totalRecieved += +t.amount;
            });
            let context = { user, totalRecieved, totalSent };
            return res.status(201).json(context);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json("Internal server error");
        }
    };
    topUpUser = async (req, res) => {
        const { id, amount } = req.body;
        const schema = this.userServices.topupSchema();
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json(errors);
        }
        const user = await this.userServices.userRepository.findOne({
            where: { id: id },
        });
        if (!user)
            return res.status(404).json("user not found");
        user.balance = Number(user.balance) + Number(amount);
        await this.userServices.userRepository.save(user);
        let context = {
            first_name: user.first_name,
            last_name: user.last_name,
            invoiceRef: this.userServices.makeid(10),
            amount: amount,
            createdAt: new Date(),
        };
        this.senDmail.sendeMail("samuelaniekan680@gmail.com", user.email, "Account Credited", (0, topUpnotify_1.default)(context, "Credited"));
        return res.json({ msg: "Account balance added", user });
    };
    editUser = async (req, res) => {
        const user = await this.userServices.userRepository.findOne({
            where: { id: parseInt(req.body.id) },
        });
        if (!user)
            return res.status(404).json("user not found");
        user.city = req.body.city;
        user.country = req.body.country;
        user.phone_number = req.body.phone_number;
        user.next_of_kin = req.body.next_of_kin;
        user.state = req.body.state;
        user.street_name = req.body.street_name;
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.date_of_birth = req.body.date_of_birth;
        user.email = req.body.email;
        user.security_pin = req.body.security_pin;
        user.zipcode = req.body.zipcode;
        await this.userServices.userRepository.save(user);
        return res.status(201).json({ user, msg: "user Updated" });
    };
    allTransactions = async (req, res) => {
        const transactions = await this.userServices.txtRepository.find({
            relations: {
                user: true,
            },
            order: {
                createdAt: "DESC",
            },
        });
        return res.status(200).json({ transactions });
    };
    singleTransactions = async (req, res) => {
        const { id } = req.params;
        const transaction = await this.userServices.txtRepository.findOne({
            where: { id: parseInt(id) },
            relations: {
                user: true,
            },
        });
        return res.status(200).json({ transaction });
    };
    editTransaction = async (req, res) => {
        const { stat, id } = req.body;
        if (!stat || !id)
            return res.status(400).json("Not found");
        const transaction = await this.userServices.txtRepository.findOne({
            where: { id: parseInt(id) },
            relations: { user: true },
        });
        if (!transaction)
            return res.status(404).json("Transaction not found");
        if (stat === "approved") {
            transaction.status = Transaction_entity_1.STATUS.SUCCESS;
            if (transaction.reciever_id) {
                const reciever = await this.userServices.userRepository.findOne({
                    where: { id: transaction.reciever_id },
                });
                if (reciever) {
                    reciever.balance =
                        Number(reciever.balance) + Number(transaction.amount);
                    await this.userServices.userRepository.save(reciever);
                    let context = {
                        first_name: reciever.first_name,
                        last_name: reciever.last_name,
                        invoiceRef: transaction.invoiceRef,
                        amount: transaction.amount,
                        createdAt: transaction.createdAt,
                    };
                    this.senDmail.sendeMail("samuelaniekan680@gmail.com", reciever.email, "Account Credited", (0, topUpnotify_1.default)(context, "Credited"));
                }
            }
        }
        else if (stat === "declined") {
            transaction.status = Transaction_entity_1.STATUS.DECLINED;
        }
        else {
            transaction.status = Transaction_entity_1.STATUS.PENDING;
        }
        await this.userServices.txtRepository.save(transaction);
        return res
            .status(201)
            .json({ transaction, msg: `Transaction ${transaction.status}` });
    };
}
exports.default = AdminController;
//# sourceMappingURL=admin.controller.js.map