import transport from "../config/mailer.config";

export class SendMail {
  sendeMail = (
    fromMail: string,
    toMail: string,
    subject: string,
    body: string
  ) => {
    transport
      .sendMail({
        from: fromMail,
        to: toMail,
        subject,
        html: body,
      })
      .catch((err) => console.log(err));
  };
}
