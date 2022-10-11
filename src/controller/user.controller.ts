import { Request, Response } from "express";
import Transaction, { STATUS } from "../entity/Transaction.entity";
import UserServices from "../services/User.service";
import { DesTxtInterFormData, DesTxtOtherFormData } from "../types";

export class UserController {
  private userServices: UserServices;
  constructor() {
    this.userServices = new UserServices();
  }

  dashBoard = async (req: Request, res: Response) => {
    const user = req.user!;
    const trans = await this.userServices.getUserTransactions(user, 5);

    return res.json({ transaction: trans, msg: "" });
  };
  transactionS = async (req: Request, res: Response) => {
    const user = req.user!;
    const trans = await this.userServices.getUserTransactions(user, undefined);
    return res.json({ transaction: trans, msg: "" });
  };
  transactionSdeTails = async (req: Request, res: Response) => {
    const { id } = req.params;

    const trx = await this.userServices.txtRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (trx) return res.status(200).json({ transaction: trx });
    else return res.status(404).json("transaction not found");
  };
  debitCard = async (req: Request, res: Response) => {
    const user = req.user!;
    const card = await this.userServices.cardRepository.findOne({
      where: { user: { id: user.id } },
      relations: { user: true },
    });
    return res.json({ card, msg: "" });
  };
  validateAccNumber = async (req: Request, res: Response) => {
    const { acc_number } = req.body;
    if (!acc_number) return res.status(400).json("Account number not provided");
    const user = await this.userServices.userRepository.findOne({
      where: { account_number: acc_number },
    });
    if (user)
      return res.status(202).json({
        beneficiary: `${user.first_name} ${user.last_name}`,
        valid: true,
      });
    else return res.json({ valid: false });
  };
  AccNumbers = async (req: Request, res: Response) => {
    const users = await this.userServices.userRepository.find();
    return res
      .status(200)
      .json({ accountNumbers: users.map((user) => user.account_number) });
  };

  tracSactionSame = async (req: Request, res: Response) => {
    const schema = this.userServices.tracSactionSameSchema();
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(errors);
    }
    const { account_number, amount } = req.body;
    const sender = req.user!;
    const reciever = await this.userServices.userRepository.findOne({
      where: { account_number: account_number },
    });

    let status: STATUS;
    let eRrr: boolean;
    if (!reciever) return res.status(404).json("user not found");
    if (sender.balance >= parseInt(amount)) {
      status = STATUS.SUCCESS;
      eRrr = false;
    } else {
      status = STATUS.DECLINED;
      eRrr = true;
    }

    const senderTxt = await this.userServices.createSametrans(
      sender,
      "send",
      req.body,
      status
    );
    await this.userServices.createSametrans(
      reciever,
      "recieve",
      req.body,
      status
    );

    return res.status(201).json({ senderTxt, error: eRrr });
  };

  tracSactionOthers = async (req: Request, res: Response) => {
    const schema = this.userServices.tracSactionOtherSchema();
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(errors);
    }
    let boDy = req.body as DesTxtOtherFormData;
    const user = req.user!;
    let status: STATUS;
    let eRrr: boolean;

    if (user.balance >= boDy.amount) {
      status = STATUS.PENDING;
      eRrr = false;
    } else {
      status = STATUS.DECLINED;
      eRrr = true;
    }
    const senderTxt = await this.userServices.createOthertrans(
      user,
      boDy,
      status
    );

    return res.status(201).json({ senderTxt, error: eRrr });
  };

  tracSactionInter = async (req: Request, res: Response) => {
    const schema = this.userServices.tracSactionInterSchema();
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json(errors);
    }
    let boDy = req.body as DesTxtInterFormData;
    const user = req.user!;
    let status: STATUS;
    let eRrr: boolean;

    if (user.balance >= boDy.amount) {
      status = STATUS.PENDING;
      eRrr = false;
    } else {
      status = STATUS.DECLINED;
      eRrr = true;
    }
    const senderTxt = await this.userServices.createIntertrans(
      user,
      boDy,
      status
    );

    return res.status(201).json({ senderTxt, error: eRrr });
  };
}
