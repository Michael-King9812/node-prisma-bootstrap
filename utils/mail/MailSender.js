const nodemailer = require('nodemailer');
const { MAIL_EMAIL, MAIL_PASSWORD } = require('../secrets');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_EMAIL,
        pass: MAIL_PASSWORD
    }
});

module.exports = transporter;
