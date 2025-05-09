import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";

dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  templete: string;
  data: Record<string, unknown>;
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, data } = options;
  const templatePath = path.resolve(
    process.cwd(),
    "templates",
    "activation.mail.ejs"
  );

  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
