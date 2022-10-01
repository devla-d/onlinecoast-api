import { Entity, Column, JoinColumn, OneToOne } from "typeorm";
import BaseModel from ".";
import { User } from "./User.entity";

@Entity("authtoken")
class Authtoken extends BaseModel {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  refreshToken: string;
}

export default Authtoken;
