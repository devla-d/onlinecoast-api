import Joi from "joi";
import { AppDataSource } from "../config/db.config";
import { User } from "../entity/User.entity";
import { UserModel } from "../types";
import * as dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import Authtoken from "../entity/Authtoken.entity";
dotenv.config();

const ACCESS_TOKEN_PRIVATE_KEY: Secret = process.env
  .ACCESS_TOKEN_PRIVATE_KEY as Secret;
const REFRESH_TOKEN_PRIVATE_KEY: Secret = process.env
  .REFRESH_TOKEN_PRIVATE_KEY as Secret;

class UserServices {
  public passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  public userRepository = AppDataSource.getRepository(User);
  public tokenRepository = AppDataSource.getRepository(Authtoken);

  async getByid(id: number) {
    const user = await User.findOne({ where: { id: id } });
    return user;
  }

  async getByUsername(username: string) {
    const user = await User.findOne({ where: { first_name: username } });
    return user;
  }

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
      const user = await User.findOne({ where: { email: email } });
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

    return newUser;
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
        role: user.roles,
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
      newpassword: Joi.string().required(),

      confirmnewpassword: Joi.string().required(),
      id: Joi.number().required(),
      email: Joi.string().email().required(),
      iat: Joi.number(),
      exp: Joi.number(),
    });
  };
}

export default UserServices;
