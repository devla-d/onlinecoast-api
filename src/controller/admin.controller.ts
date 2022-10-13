import { Request, Response } from "express";
import NodeCache from "node-cache";
import { STATUS } from "../entity/Transaction.entity";
import UserServices from "../services/User.service";

const cache = new NodeCache({ stdTTL: 15 });

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
  singleUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let userId = parseInt(id);
      if (cache.has(userId)) {
        return res.status(200).json(cache.get(id));
      }
      const user = await this.userServices.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) return res.status(404).json("User not found");
      let totalSent = 0;
      let totalRecieved = 0;
      const trx = await this.userServices.txtRepository.find({
        where: { user: { id: user.id } },
      });

      trx.forEach((t) => {
        if (t.mode === "send") totalSent += +t.amount;
        else totalRecieved += +t.amount;
      });

      let context = { user, totalRecieved, totalSent };

      cache.set(userId, context, 5000);

      return res.status(201).json(context);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server error");
    }
  };
}
