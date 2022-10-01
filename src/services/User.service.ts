import Joi from "joi";
import { join } from "path";
import { AppDataSource } from "../config/db.config";
import { User } from "../entity/User.entity";
import { UserModel } from "../types";

class UserServices {
  public passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  public userRepository = AppDataSource.getRepository(User);

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
    newUser.phone_number = data.password;
    newUser.next_of_kin = data.next_of_kin;

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
}

export default UserServices;
