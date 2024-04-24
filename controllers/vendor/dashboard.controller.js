const CustomError = require('../../utils/CustomError');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getBusinessDetails = asyncErrorHandler(async (req, res, next) => {
    return res.json(`Yeah dashboard is loading successfully!`);
});