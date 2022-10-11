import { Entity, Column, JoinColumn, OneToOne } from "typeorm";
import BaseModel from ".";
import { User } from "./User.entity";

export enum STATUS {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  DECLINED = "DECLINED",
}

@Entity("transaction")
class Transaction extends BaseModel {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @Column()
  mode: string;

  @Column({ type: "numeric" })
  amount: number;

  @Column()
  benneficiary_name: string;

  @Column()
  benneficiary_accnumber: string;

  @Column({ nullable: true })
  bic_code: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  purpose: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: "enum", enum: STATUS, default: STATUS.PENDING })
  status: STATUS;
}

export default Transaction;
