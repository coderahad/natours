const nodemailer = require('nodemailer');
// 1) Create a transporter
const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      email: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD
    }
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Ahad hossain <hossain1814@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
  await transporter.sendMail(mailOptions);

  // 3)Actually send email to clients
};

module.exports = sendEmail;
