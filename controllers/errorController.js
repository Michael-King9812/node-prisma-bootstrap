const CustomError = require("../utils/CustomError");

const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}!`;
    new CustomError(msg, 400)
}

const handleExpiredJWT = (err) => {
    return new CustomError('Session has expired. Pleas login again!', 401);
}

const handleJWTError = (err) => {
    return new CustomError('Invalid token. Please login again!', 401);
}

const handlePrismaValidationError = (err) => {
    return new CustomError('Unauthorized!', 403);
}



const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        });
    }
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(res, error);
    } else if(process.env.NODE_ENV == 'production') {
        if(error.name === 'CastError') error = castErrorHandler(error);
        if(error.name === 'TokenExpiredError') error = handleExpiredJWT(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error)
        if (error.name === 'PrismaClientValidationError') error = handlePrismaValidationError(error)
        prodErrors(res, error);
    }
}