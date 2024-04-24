const express = require('express');
const { vendor } = require('../../middleware/authentication/vendor');
const vendorDashboardController = require('../../controllers/vendor/dashboard.controller');


const router = express.Router();

router.route('/dashboard').get(vendor, vendorDashboardController.getBusinessDetails);
router.route('/shop').get(vendor, );

module.exports = router;