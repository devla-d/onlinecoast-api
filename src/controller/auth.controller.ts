import e, { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserServices from "../services/User.service";
import jwt, { Secret } from "jsonwebtoken";
import { SendMail } from "../services/sendemail.service";
import confirmaTionMail from "../services/confirmationEmail";
import { UserModel } from "../types";
import path from "path";
import { welcomEmail } from "../services/welcomeEmail";

const SRC_DIR = path.join(__dirname, "..");
const MEDIAPATH = path.join(SRC_DIR, "public/media");

const SECRET_KEY = process.env.SECRET_KEY as Secret;
export class AuthController {
  private userServices: UserServices;
  private senDmail: SendMail;
  constructor() {
    this.userServices = new UserServices();
    this.senDmail = new SendMail();
  }

  availableData = async (req: Request, res: Response) => {
    const users = await this.userServices.userRepository.find();
    const emails = users.map((user) => user.email);
    return res.json({ existingEmails: emails });
  };

  regisTer = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);

      const payload = {
        email: email,
        password: passwordHash,
      };
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "15m",
      });

      this.senDmail.sendeMail(
        "samuelaniekan680@gmail.com",
        email,
        "welcome to onlineseacoast, confirm your email address",
        confirmaTionMail(token)
      );
      return res.status(200).json({ msg: "Email sent successfuly" });
    } catch (error) {
      console.log(error);
      return res.status(500).json("something went wrong");
    }
  };

  verifyRegisTer = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) return res.status(400);
    jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
      if (err) return res.json({ error: "Token Error" });
      return res.json({ user: user });
    });
  };

  createAccount = async (req: Request, res: Response) => {
    const body = req.body as UserModel;
    if (!req.files) return res.status(400).json({ error: "file required" });
    let user = await this.userServices.userRepository.findOne({
      where: {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
      },
    });

    if (user)
      return res.status(200).json({ user: user, msg: "created successfully" });
    var image = req.files.profile_img as any;
    var imageName = `/${Date.now()}-${image.name}`;
    image.mv(MEDIAPATH + imageName, async (error: any) => {
      if (error) return res.status(406).json({ error: "error uploading file" });
      const newUser = await this.userServices.createUser(
        body,
        `/media${imageName}`
      );

      this.senDmail.sendeMail(
        "samuelaniekan680@gmail.com",
        newUser.email,
        "welcome to onlineseacoast",
        welcomEmail(
          newUser.account_number,
          `${newUser.first_name} ${newUser.last_name}`
        )
      );

      return res
        .status(201)
        .json({ muser: newUser, msg: "created successfully" });
    });
  };

  logIN = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const schema = this.userServices.loginSchema();
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.json({ errors: errors });
    }
    const user = await this.userServices.userRepository.findOne({
      where: { account_number: username },
    });
    if (!user)
      return res.json({ errors: "Account Number Or Password is Invalid" });
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.json({ errors: "Account Number Or Password is Invalid" });
    const { accessToken, refreshToken } =
      await this.userServices.generateTokens(user);
    return res.json({
      msg: "Sucessfuly loggin",
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  };
}
