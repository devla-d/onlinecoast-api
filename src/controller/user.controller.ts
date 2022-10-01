import { Request, Response } from "express";
import UserServices from "../services/User.service";

export class UserController {
  private userServices: UserServices;
  constructor() {
    this.userServices = new UserServices();
  }

  dashBoard = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await this.userServices.getByid(parseInt(id));
    return res.json(user);
  };
}
