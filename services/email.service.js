const nodemailer = require("nodemailer");
const { PORT, PASSWORD, emailFrom } = require("../helpers/env");

const BASE_URL = `http://localhost:${PORT}/api`;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "yulia_me@meta.ua",
    pass: PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (userEmail, code) => {
  const link = `${BASE_URL}/users/verify/${code}`;
  // NODEMAILER
  try {
    const emailOptions = await transporter.sendMail({
      to: userEmail,
      from: emailFrom,
      subject: "Confirm your email",
      html: `<h4>Click on this link to confirm registration:<br><a href=${link}>Confirm Email</a></h4>`,
    });
    console.log(emailOptions);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports = {
  sendEmail,
};
