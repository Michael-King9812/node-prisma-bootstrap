const CustomError = require('../../utils/CustomError');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const random = require('randomized-string');
const { vendorValidator, vendorLoginValidator, vendorOtpValidator, forgotPasswordValidator, resetPasswordValidator } = require('../../utils/validator/vendorAuthentication.module');
const { sendOTPMail } = require('../../utils/mail/template/vendor/sendOTPMail');
const { resetPasswordMail } = require('../../utils/mail/template/vendor/resetPasswordMail');
const { signToken, resetPasswordToken } = require('../../utils/jsonWebToken');

const prisma = new PrismaClient();

exports.register = asyncErrorHandler(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, confirmPassword, referralCode } = req.body;
    
    const { error } = vendorValidator(req.body);

    if (error) {
        next(new CustomError(error.details[0].message, 400));
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return next(new CustomError('Passwords do not match', 400));
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if vendor with the provided email already exists
    const existingVendor = await prisma.vendor.findFirst({ where: { email } });
    if (existingVendor) {
        return next(new CustomError('Vendor already exists!', 400));
    }
    // return res.json(random.generate({charset: 'number', length: 6}))

    if (referralCode) {
        // Check if referralCode exists
        const existingReferralVendor = await prisma.vendor.findFirst({ where: { inviteCode: referralCode } });
        
        if (!existingReferralVendor) {
            return next(new CustomError('Referral code does not exist!', 400));
        }
    }

    // Create new vendor
    const vendor = await prisma.vendor.create({
        data: {
            firstName,
            lastName,
            email,
            phone,
            inviteCode: random.generate(12),
            referralCode,
            password: hashedPassword
        }
    });

    const otp = random.generate({charset: 'number', length: 6});

    // Delete any existing OTP associated with the email
    await prisma.verifyOTP.deleteMany({ where: { email } });

    await prisma.verifyOTP.create({
        data: {
            email,
            otp:parseInt(otp)
        }
    });

    sendOTPMail(email, otp);
    return res.status(200).json({ success: true, message: "Account created successfully!", vendor });
});

// Function to login a vendor
exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const { error } = vendorLoginValidator(req.body);

    if (error) {
        next(new CustomError(error.details[0].message, 400));
    }


    // Find the vendor by email
    const vendor = await prisma.vendor.findFirst({ where: { email } });

    // If vendor not found, return error
    if (!vendor) {
        return next(new CustomError('Invalid email or password', 401));
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, vendor.password);

    // If passwords don't match, return error
    if (!passwordMatch) {
        return next(new CustomError('Invalid email or password', 401));
    }
    
    const token = signToken(vendor.id);

    // Passwords match, return success response
    return res.status(200).json({ success: true, message: 'Login successful', token });
});

// Function to verify OTP
exports.verifyOTP = asyncErrorHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    const { error } = vendorOtpValidator(req.body);

    if (error) {
        next(new CustomError(error.details[0].message, 400));
    }

    // Find the OTP record for the given email
    const otpRecord = await prisma.verifyOTP.findFirst({ where: { email, otp: parseInt(otp) } });

    // If OTP record not found, return error
    if (!otpRecord) {
        return next(new CustomError('Invalid OTP', 401));
    }

    // Transaction to delete OTP record and update vendor table
    await prisma.$transaction([
        prisma.vendor.update({
            where: { email },
            data: { email_verification: true } // Set email_verification to true
        }),
        prisma.verifyOTP.deleteMany({ where: { email } }) // Delete all OTP records for the given email
    ]);

    // OTP verified successfully, return success response
    return res.status(200).json({ success: true, message: 'OTP verified successfully' });
});


// Forgot password endpoint
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;

    // Find the vendor with the provided email
    const vendor = await prisma.vendor.findFirst({ where: { email } });

    const { error } = forgotPasswordValidator(req.body);

    if (error) {
        next(new CustomError(error.details[0].message, 400));
    }

    if (!vendor) {
        // If vendor does not exist, return error
        return next(new CustomError('Vendor not found', 404));
    }

    try {
        // Delete any existing reset tokens associated with the email
        await prisma.resetToken.deleteMany({ where: { email } });

        // Generate a reset token
        const resetToken = resetPasswordToken(email);

        // Create a new reset token
        await prisma.resetToken.create({ data: { email, token: resetToken } });

        // Send reset password email with the reset token
        resetPasswordMail(email, resetToken);

        // Respond with success message
        return res.status(200).json({ success: true, message: 'Reset password email sent successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        next(new CustomError('Failed to send reset password email', 500));
    }
});

// Reset password endpoint
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    const { resetToken, newPassword } = req.body;

    try {
        
        const { error } = resetPasswordValidator(req.body);

        if (error) {
            next(new CustomError(error.details[0].message, 400));
        }

        // Verify the reset token
        const decoded = verifyToken(resetToken);

        // Find the vendor with the provided email
        const vendor = await prisma.vendor.findFirst({ where: { email: decoded.email } });

        if (!vendor) {
            // If vendor does not exist, return error
            return next(new CustomError('Vendor not found', 404));
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the vendor's password
        // Transaction to delete OTP record and update vendor table
        await prisma.$transaction([
            prisma.vendor.update({
                where: { email: decoded.email },
                data: { password: hashedPassword }
            }),
            prisma.resetToken.deleteMany({ where: { email: decoded.email } }) // Delete all OTP records for the given email
        ]);

        // Respond with success message
        return res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        // If reset token is invalid or expired, return error
        return next(new CustomError('Invalid or expired reset token', 400));
    }  
});


