import { Request, Response, NextFunction } from "express";
import UserServices from "../services/User.service";

import "dotenv/config";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

import { User } from "../entity/User.entity";

const SECRET_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY as Secret;

export class AuthMiddleWare {
  private userServices: UserServices;
  constructor() {
    this.userServices = new UserServices();
  }

  authRequired = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, async (err: any, user) => {
      if (err) return res.status(401).json({ msg: "Token Expired" });
      const payload = user as JwtPayload;
      const uSer = await this.userServices.userRepository.findOne({
        where: { id: payload.id, email: payload.email },
      });
      if (!uSer) return res.status(400).json({ msg: "No User" });

      req.user = uSer;

      next();
    });
  };

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
