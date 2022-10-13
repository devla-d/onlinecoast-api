import Joi from "joi";
import { AppDataSource } from "../config/db.config";
import { User } from "../entity/User.entity";
import { DesTxtInterFormData, DesTxtOtherFormData, UserModel } from "../types";
import * as dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import Authtoken from "../entity/Authtoken.entity";
import Transaction, { STATUS } from "../entity/Transaction.entity";
import Card from "../entity/Cards.entity";
import moment from "moment";
import { SendMail } from "./sendemail.service";
import topUpNotify from "./topUpnotify";
dotenv.config();

const ACCESS_TOKEN_PRIVATE_KEY: Secret = process.env
  .ACCESS_TOKEN_PRIVATE_KEY as Secret;
const REFRESH_TOKEN_PRIVATE_KEY: Secret = process.env
  .REFRESH_TOKEN_PRIVATE_KEY as Secret;

class UserServices {
  public passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  public userRepository = AppDataSource.getRepository(User);
  public tokenRepository = AppDataSource.getRepository(Authtoken);
  public txtRepository = AppDataSource.getRepository(Transaction);
  public cardRepository = AppDataSource.getRepository(Card);
  private senDmail = new SendMail();

  registerSchema = () => {
    return Joi.object().keys({
      email: Joi.string().min(3).max(50).email().required(),
      password: Joi.string().pattern(this.passwordRules).messages({
        "string.pattern.base":
          "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
      }),
    });
  };

  validatEmail = async (email: string) => {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (user) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  };

  createUser = async (data: UserModel, img: string) => {
    const newUser = new User();
    newUser.account_type = data.account_type;
    newUser.city = data.city;
    newUser.country = data.country;
    newUser.date_of_birth = data.date_of_birth;
    newUser.email = data.email;
    newUser.first_name = data.first_name;
    newUser.gender = data.gender;
    newUser.profile_img = img;
    newUser.last_name = data.last_name;
    newUser.password = data.password;
    newUser.zipcode = data.zipcode;
    newUser.street_name = data.street_name;
    newUser.security_pin = data.security_pin;
    newUser.state = data.state;
    newUser.phone_number = data.phone_number;
    newUser.next_of_kin = data.next_of_kin;
    newUser.account_number = Math.random().toString().slice(2, 12);

    await this.userRepository.save(newUser);
    await this.createNewUserCard(newUser);

    return newUser;
  };

  createNewUserCard = async (user: User) => {
    const d2 = new Date("2025");
    const newCard = new Card();
    newCard.user = user;
    newCard.billing_address = `${user.street_name},${user.city}`;
    newCard.card_number = `5${Math.random().toString().slice(2, 17.8)}`;
    newCard.card_cvv = Math.random().toString().slice(2, 5);
    newCard.card_name = user.first_name + " " + user.last_name;
    newCard.card_type = "Master Card";
    newCard.zipcode = user.zipcode;
    newCard.expire = moment(d2).format("MM/YY");

    await this.cardRepository.save(newCard);

    return newCard;
  };

  createUserSchema = () => {
    return Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      phone_number: Joi.string().required(),
      date_of_birth: Joi.string().required(),
      gender: Joi.string().required(),
      next_of_kin: Joi.string().required(),
      street_name: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zipcode: Joi.string().required(),

      security_pin: Joi.string().required(),
      account_type: Joi.string().required(),
      profile_img: Joi.string(),
      iat: Joi.string(),
      exp: Joi.string(),
    });
  };

  generateTokens = async (user: User) => {
    try {
      const payload = {
        id: user.id,
        email: user.email,
      };
      const accessToken = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(payload, REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: "1d",
      });

      const authToken = await this.tokenRepository.findOne({
        where: { user: { id: user.id } },
      });
      if (!authToken) {
        const newToken = new Authtoken();
        newToken.user = user;
        newToken.refreshToken = refreshToken;

        await this.tokenRepository.save(newToken);
      } else {
        authToken.refreshToken = refreshToken;
        await this.tokenRepository.save(authToken);
      }

      return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  };
  newAccessToken = (user: User) => {
    const payload = {
      id: user.id,
      role: user.roles,
      email: user.email,
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "15m",
    });

    return accessToken;
  };

  loginSchema = () => {
    return Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
  };
  resetPasswordSchema = () => {
    return Joi.object().keys({
      email: Joi.string().email().required(),
    });
  };
  resetPasswordSchemaSecond = () => {
    return Joi.object().keys({
      newpassword: Joi.string().pattern(this.passwordRules).messages({
        "string.pattern.base":
          "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
      }),

      confirmnewpassword: Joi.string().pattern(this.passwordRules).messages({
        "string.pattern.base":
          "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
      }),
      id: Joi.number().required(),
      email: Joi.string().email().required(),
      iat: Joi.number(),
      exp: Joi.number(),
    });
  };

  tracSactionSameSchema = () => {
    return Joi.object().keys({
      amount: Joi.number().required(),
      account_number: Joi.string().required(),
      purpose: Joi.string().optional().allow(""),
      beneficiary: Joi.string().required(),
    });
  };

  tracSactionOtherSchema = () => {
    return Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      phone: Joi.string().optional().allow(""),
      email: Joi.string().email().optional().allow(""),
      ben_account_number: Joi.string().required(),
      iban_number: Joi.string().required(),
      bank_name: Joi.string().required(),
      swift_code: Joi.string().required(),
      amount: Joi.number().required(),
      purpose: Joi.string().optional().allow(""),
    });
  };

  tracSactionInterSchema = () => {
    return Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      city: Joi.string().optional().allow(""),
      country: Joi.string().optional().allow(""),
      ben_account_number: Joi.string().required(),
      iban_number: Joi.string().required(),
      bank_name: Joi.string().required(),
      swift_code: Joi.string().required(),
      amount: Joi.number().required(),
      purpose: Joi.string().optional().allow(""),
    });
  };

  getUserTransactions = async (user: User, limit: number | undefined) => {
    if (limit) {
      const [txt] = await this.txtRepository.findAndCount({
        where: { user: { id: user.id } },
        take: limit,
        order: {
          createdAt: "DESC",
        },
      });

      return txt;
    } else {
      // const txt = await this.txtRepository.find({
      //   where: { user: { id: user.id } },order:,
      // });

      const txt = await this.txtRepository
        .createQueryBuilder("transaction")
        .where("transaction.user.id = :id", { id: user.id })
        .orderBy("createdAt", "DESC")
        .getMany();

      return txt;
    }
  };
  /**
   * create transaction entity for the same bank
   *
   * @param user
   * @param mode
   * @param param2
   * @param status
   * @returns
   */
  createSametrans = async (
    user: User,
    mode: "send" | "recieve",
    { amount, account_number, purpose, beneficiary }: any,
    status: STATUS,
    reciever: User | undefined
  ) => {
    const newTransaction = new Transaction();
    newTransaction.amount = amount;
    newTransaction.benneficiary_accnumber = account_number;
    newTransaction.purpose = purpose;
    newTransaction.benneficiary_name = beneficiary;
    newTransaction.user = user;
    newTransaction.mode = mode;
    newTransaction.status = status;
    newTransaction.invoiceRef = this.makeid(10);
    if (mode == "send" && reciever) {
      user.balance = Number(user.balance) - Number(amount);
      newTransaction.reciever_id = reciever.id;
      let context = {
        first_name: user.first_name,
        last_name: user.last_name,
        invoiceRef: newTransaction.invoiceRef,
        amount: newTransaction.amount,
        createdAt: newTransaction.createdAt,
      };
      this.senDmail.sendeMail(
        "samuelaniekan680@gmail.com",
        user.email,
        "Account Credited",
        topUpNotify(context, "Debited")
      );
    }
    // if (mode == "recieve" && status == STATUS.SUCCESS) {
    //   user.balance = Number(user.balance) + Number(amount);
    // }
    await this.userRepository.save(user);

    await this.txtRepository.save(newTransaction);

    return newTransaction;
  };
  /**
   * create transaction entity for other banks
   *
   * @param user
   * @param body
   * @param status
   * @returns
   */
  createOthertrans = async (
    user: User,
    body: DesTxtOtherFormData,
    status: STATUS
  ) => {
    const newTransaction = new Transaction();
    newTransaction.amount = body.amount;
    newTransaction.benneficiary_accnumber = body.iban_number;
    newTransaction.purpose = body.purpose;
    newTransaction.benneficiary_name = body.first_name + " " + body.last_name;
    newTransaction.user = user;
    newTransaction.mode = "send";
    newTransaction.status = status;
    newTransaction.invoiceRef = this.makeid(10);
    if (status == STATUS.PENDING) {
      user.balance = Number(user.balance) - Number(body.amount);
    }

    await this.userRepository.save(user);

    await this.txtRepository.save(newTransaction);

    return newTransaction;
  };

  /**
   * create transaction entity for international banks
   *
   * @param user
   * @param body
   * @param status
   * @returns
   */
  createIntertrans = async (
    user: User,
    body: DesTxtInterFormData,
    status: STATUS
  ) => {
    const newTransaction = new Transaction();
    newTransaction.amount = body.amount;
    newTransaction.benneficiary_accnumber = body.iban_number;
    newTransaction.purpose = body.purpose;
    newTransaction.benneficiary_name = body.first_name + " " + body.last_name;
    newTransaction.user = user;
    newTransaction.mode = "send";
    newTransaction.status = status;
    newTransaction.invoiceRef = this.makeid(10);
    if (status == STATUS.PENDING) {
      user.balance = Number(user.balance) - Number(body.amount);
    }

    await this.userRepository.save(user);

    await this.txtRepository.save(newTransaction);

    return newTransaction;
  };

  changePasswordSchema = () => {
    return Joi.object().keys({
      oldpassword: Joi.string().required(),
      newpassword: Joi.string().pattern(this.passwordRules).messages({
        "string.pattern.base":
          "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
      }),

      confirmnewpassword: Joi.string().pattern(this.passwordRules).messages({
        "string.pattern.base":
          "password Require at  1 upper case letter, 1 lower case letter, 1 numeric digit.",
      }),
    });
  };

  resetPinSchema = () => {
    return Joi.object().keys({
      oldpin: Joi.string().min(4).max(4).required(),
      newpin: Joi.string().min(4).max(4).required(),
    });
  };
  makeid(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  topupSchema = () => {
    return Joi.object().keys({
      amount: Joi.number().required(),
      id: Joi.number().required(),
    });
  };
}

export default UserServices;
