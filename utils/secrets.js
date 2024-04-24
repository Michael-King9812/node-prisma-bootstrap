require('dotenv').config();

exports.APP_URL = process.env.APP_URL
exports.APP_NAME = process.env.APP_NAME
exports.NODE_ENV =  process.env.NODE_ENV
exports.PORT = process.env.PORT

// MAILING
exports.MAIL_EMAIL = process.env.MAIL_EMAIL
exports.MAIL_PASSWORD = process.env.MAIL_PASSWORD
exports.MAIL_FROM = process.env.MAIL_FROM

exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
exports.JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME