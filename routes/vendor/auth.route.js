const express = require('express');
const vendorAuthController = require('../../controllers/vendor/auth.controller');

const router = express.Router();

router.route('/register').post(vendorAuthController.register);
router.route('/login').post(vendorAuthController.login);
router.route('/forgot-password').post(vendorAuthController.forgotPassword);
router.route('/reset-password').post(vendorAuthController.resetPassword);
router.route('/verify-otp').post(vendorAuthController.verifyOTP);

// Routes for OAuth authentication with Google, Facebook, and Apple
// router.get('/auth/google', vendorAuthController.googleAuth);
// router.get('/auth/google/callback', vendorAuthController.googleAuthCallback);

// router.get('/auth/facebook', vendorAuthController.facebookAuth);
// router.get('/auth/facebook/callback', vendorAuthController.facebookAuthCallback);

// router.get('/auth/apple', vendorAuthController.appleAuth);
// router.get('/auth/apple/callback', vendorAuthController.appleAuthCallback);


module.exports = router;