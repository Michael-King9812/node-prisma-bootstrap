const nodemailer = require('nodemailer');
const { MAIL_FROM, APP_NAME, APP_URL } = require('../../../secrets');
const transporter = require('../../MailSender');

// Function to send email
exports.resetPasswordMail = async (email, token) => {
  const mailOptions = {
    from: MAIL_FROM,
    to: email,
    subject: `${APP_NAME} Vendor Reset Password Token`,
    text: `Hi ${email}! Your reset token is: ${APP_URL}/vendor/auth/${token}`
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
