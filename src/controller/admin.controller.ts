import { Request, Response } from "express";
import NodeCache from "node-cache";
import { STATUS } from "../entity/Transaction.entity";
import { SendMail } from "../services/sendemail.service";
import topUpNotify from "../services/topUpnotify";
import UserServices from "../services/User.service";

export default class AdminController {
  private userServices: UserServices;
  private senDmail: SendMail;

  constructor() {
    this.userServices = new UserServices();
    this.senDmail = new SendMail();
  }

  dashbaord = async (req: Request, res: Response) => {
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

  allUsers = async (req: Request, res: Response) => {
    const [user, userCount] =
      await this.userServices.userRepository.findAndCount();

    return res.json({ user });
  };
  singleUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let userId = parseInt(id);

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

      return res.status(201).json(context);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal server error");
    }
  };

  topUpUser = async (req: Request, res: Response) => {
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
    if (!user) return res.status(404).json("user not found");
    user.balance = Number(user.balance) + Number(amount);
    await this.userServices.userRepository.save(user);
    let context = {
      first_name: user.first_name,
      last_name: user.last_name,
      invoiceRef: this.userServices.makeid(10),
      amount: amount,
      createdAt: new Date(),
    };
    this.senDmail.sendeMail(
      this.userServices.FROMEMail,
      user.email,
      "Account Credited",
      topUpNotify(context, "Credited")
    );
    return res.json({ msg: "Account balance added", user });
  };

  editUser = async (req: Request, res: Response) => {
    const user = await this.userServices.userRepository.findOne({
      where: { id: parseInt(req.body.id) },
    });
    if (!user) return res.status(404).json("user not found");

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

  allTransactions = async (req: Request, res: Response) => {
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

  singleTransactions = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await this.userServices.txtRepository.findOne({
      where: { id: parseInt(id) },
      relations: {
        user: true,
      },
    });

    return res.status(200).json({ transaction });
  };

  editTransaction = async (req: Request, res: Response) => {
    const { stat, id } = req.body;
    if (!stat || !id) return res.status(400).json("Not found");
    const transaction = await this.userServices.txtRepository.findOne({
      where: { id: parseInt(id) },
      relations: { user: true },
    });
    if (!transaction) return res.status(404).json("Transaction not found");

    if (stat === "approved") {
      transaction.status = STATUS.SUCCESS;
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
          this.senDmail.sendeMail(
            this.userServices.FROMEMail,
            reciever.email,
            "Account Credited",
            topUpNotify(context, "Credited")
          );
        }
      }
    } else if (stat === "declined") {
      transaction.status = STATUS.DECLINED;
    } else {
      transaction.status = STATUS.PENDING;
    }

    await this.userServices.txtRepository.save(transaction);

    return res
      .status(201)
      .json({ transaction, msg: `Transaction ${transaction.status}` });
  };
}
