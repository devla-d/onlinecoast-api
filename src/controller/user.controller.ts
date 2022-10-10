import { Request, Response } from "express";
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
}
