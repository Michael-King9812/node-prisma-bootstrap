const express = require('express');
const morgan = require('morgan');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controllers/errorController');
const { NODE_ENV } = require('./utils/secrets');
const vendorAuthRoute = require('./routes/vendor/auth.route');
const vendorDashboard = require('./routes/vendor/dashboard.route')

let app = express();

app.use(express.json());

if ( NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// USING ROUTES

app.use('/api/vendor/auth', vendorAuthRoute);
app.use('/api/vendor', vendorDashboard);

app.all('*', (req, res, next) => {

    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404)

    next(err);
});

app.use(globalErrorHandler);

module.exports = app;