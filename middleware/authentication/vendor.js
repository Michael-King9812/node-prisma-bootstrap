const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { verifyToken } = require("../../utils/jsonWebToken");

const prisma = new PrismaClient();

exports.vendor = asyncErrorHandler(async (req, res, next) => {
    // 1. Read the token & check if it exists
    const testToken = req.headers.authorization;

    let token;

    if (testToken && testToken.startsWith('bearer')) {
        token = testToken.split(' ')[1];
    }

    if (!token) {
        next(new CustomError('You are not logged in!', 401))
    }

    // 2. Validate the token
    const decodedToken = verifyToken(token);

    // 3. Check if user exists
    const vendor = await prisma.vendor.findFirst({ where: { id: decodedToken.id } });
    prisma.vendor.findFirst({ where: {
        id: decodedToken.id
    } });

    if (!vendor) {
        next(new CustomError('Not Unauthorized!', 403));
    }

    // 4. Check if the user changed password after the token has issues
    
    // 5. Allow user to access route
    req.vendor = vendor;

    next();
});