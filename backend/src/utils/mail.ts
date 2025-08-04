import nodemailer from "nodemailer";
export type SendEmailOptions = {
  email: string;
  subject: string;
  message?: string;
  html?: string;
};

const sendEmail = async (options: SendEmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Vishraam App <rajat.dev0305@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
