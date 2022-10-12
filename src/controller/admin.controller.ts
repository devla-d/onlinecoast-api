import { Request, Response } from "express";
import { STATUS } from "../entity/Transaction.entity";
import UserServices from "../services/User.service";

export default class AdminController {
  private userServices: UserServices;
  constructor() {
    this.userServices = new UserServices();
  }

  dashbaord = async (req: Request, res: Response) => {
    const admin = req.user!;

    const [, trxCount] = await this.userServices.txtRepository.findAndCount();
    const [user, userCount] =
      await this.userServices.userRepository.findAndCount();
    const [, completTrxCount] =
      await this.userServices.txtRepository.findAndCount({
        where: { status: STATUS.SUCCESS },
      });
    const [, pendingTrxCount] =
      await this.userServices.txtRepository.findAndCount({
        where: { status: STATUS.PENDING },
      });
    let totalBalance = 0;
    user.forEach((us) => {
      totalBalance += +us.balance;
      console.log(totalBalance);
    });

    return res.json({
      trxCount,
      userCount,
      completTrxCount,
      pendingTrxCount,
      totalBalance,
    });
  };

  allUsers = async (req: Request, res: Response) => {
    const [user, userCount] =
      await this.userServices.userRepository.findAndCount();

    return res.json({ user });
  };
}
