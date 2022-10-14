import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;

const transport = nodemailer.createTransport({
  host: "onlineseacoastacct.net",
  port: 465,

  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export default transport;
