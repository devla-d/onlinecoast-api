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
}
