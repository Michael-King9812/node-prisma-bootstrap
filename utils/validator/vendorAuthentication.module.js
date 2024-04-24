const Joi = require('joi');

exports.vendorValidator = function validator(data) {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(30).required().label('First Name'),
        lastName: Joi.string().min(1).max(30).required().label('Last Name'),
        email: Joi.string().email().min(1).max(30).required().label('Email'),
        phone: Joi.string().min(1).max(18).required().label('Phone'),
        referralCode: Joi.string().min(1).max(15).label('Last Name'),
        password: Joi.string().min(1).max(30).required().label('Password'),
        confirmPassword: Joi.string().min(1).max(30).required().label('Confirm Password'),
    });

    return schema.validate(data);
}

exports.vendorLoginValidator = function validator(data) {
    const schema = Joi.object({
        email: Joi.string().email().min(1).max(30).required().label('Email'),
        password: Joi.string().min(1).max(30).required().label('Password'),
    });

    return schema.validate(data);
}

exports.vendorOtpValidator = function validator(data) {
    const schema = Joi.object({
        email: Joi.string().email().min(1).max(30).required().label('Email'),
        otp: Joi.string().min(1).max(6).required().label('OTP'),
    });

    return schema.validate(data);
}

exports.forgotPasswordValidator = function validator(data) {
    const schema = Joi.object({
        email: Joi.string().email().min(1).max(30).required().label('Email')
    });

    return schema.validate(data);
}

exports.resetPasswordValidator = function validator(data) {
    const schema = Joi.object({
        resetToken: Joi.string().min(1).required().label('Rest Token'),
        newPassword: Joi.string().min(1).max(30).required().label('Password'),
    });

    return schema.validate(data);
}