import { Entity, Column, JoinColumn, OneToOne } from "typeorm";
import BaseModel from ".";
import { User } from "./User.entity";

@Entity("card")
class Card extends BaseModel {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  card_number: string;

  @Column()
  card_type: string;

  @Column()
  card_name: string;

  @Column()
  card_cvv: string;

  @Column()
  billing_address: string;

  @Column()
  zipcode: string;

  @Column()
  expire: string;
}

export default Card;
