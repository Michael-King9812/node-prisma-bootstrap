const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, JWT_EXPIRY_TIME } = require('./secrets');

// Function to sign a JWT token
exports.signToken = id => {
    return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRY_TIME });
};

// Function to verify a JWT token
exports.verifyToken = token => {
    return jwt.verify(token, JWT_SECRET_KEY);
};

// Function to generate a reset password token
exports.resetPasswordToken = email => {
    return jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRY_TIME });
};