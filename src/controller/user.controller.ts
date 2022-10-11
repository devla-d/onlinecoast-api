import { Request, Response } from "express";
import Transaction, { STATUS } from "../entity/Transaction.entity";
import UserServices from "../services/User.service";

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
    console.log(sender, reciever);
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
}
