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
        console.log("Hit the cache");
        return res.status(200).json({ user: cache.get(id) });
      }
      const user = await this.userServices.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) return res.status(404).json("User not found");
      cache.set(userId, user, 5000);
      console.log("Hit the db");
      return res.status(201).json({ user: user });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server error");
    }
  };
}
