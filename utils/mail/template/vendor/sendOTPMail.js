const nodemailer = require('nodemailer');
const { MAIL_FROM, APP_NAME } = require('../../../secrets');
const transporter = require('../../MailSender');

// Function to send email
exports.sendOTPMail = async (email, otp) => {
  const mailOptions = {
    from: MAIL_FROM,
    to: email,
    subject: `${APP_NAME} Vendor OTP verification code`,
    text: `Hi ${email}! Your OTP verification code is: ${otp}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true; // Return true if email is sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}
