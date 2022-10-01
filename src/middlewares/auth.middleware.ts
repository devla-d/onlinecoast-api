import { Request, Response, NextFunction } from "express";
import UserServices from "../services/User.service";

export class AuthMiddleWare {
  private userServices: UserServices;
  constructor() {
    this.userServices = new UserServices();
  }

  validateRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;
    const schema = this.userServices.registerSchema();
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.json({ errors: errors });
    }
    const emailExist = await this.userServices.validatEmail(email);

    if (emailExist) return res.json({ error: "email already exist" });

    next();
  };

  validateCreateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = this.userServices.createUserSchema();
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((e) => e.message);

      return res.json({ errors: errors });
    }
    next();
  };
}
