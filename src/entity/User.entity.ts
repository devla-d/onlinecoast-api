import { Entity, Column } from "typeorm";
import BaseModel from ".";

enum Roles {
  ADMIN = "admin",
  USER = "user",
}

@Entity()
export class User extends BaseModel {
  @Column({ unique: true })
  email: string;
  @Column({ unique: true, nullable: true })
  account_number: string;
  @Column({ default: 0 })
  balance: number;
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column()
  phone_number: string;
  @Column()
  date_of_birth: string;
  @Column()
  gender: string;
  @Column()
  next_of_kin: string;
  @Column()
  street_name: string;
  @Column()
  city: string;
  @Column()
  state: string;
  @Column()
  country: string;
  @Column()
  zipcode: string;
  @Column()
  security_pin: string;
  @Column()
  account_type: string;
  @Column()
  profile_img: string;

  @Column({ type: "enum", enum: Roles, default: Roles.USER })
  roles: Roles;

  @Column({ type: Boolean, default: true })
  is_active: boolean;

  @Column()
  password: string;
}
