const express = require('express');
const router = express.Router();
require('express-validator');
const helperFunc = require("./helperFunctions");
const {body, validationResult} = require("express-validator");
const countries = require('../public/assets/Countries');
module.exports = router;


/* POST update product cogs. */
router.post('/',
    body('id', 'Invalid Product id').exists().isAlphanumeric(),
    body('id', 'Invalid Product id').exists().isAlphanumeric(),
    body('productName', 'Product Name cannot be empty or missing').not().isEmpty(),
    body('cogs.unitManufacturingCost', "Invalid Unit Manufacturing Cost").isInt({min: 0}),
    body('cogs.shipmentUnitCost', "Invalid Shipment Unit Cost").isInt({min: 0}),
    body('cogs.monthlyAdvertismentCost', "Invalid monthly Advertisement Cost").isInt({min: 0}),
    body('cogs.shipmentUnitCost', "Invalid Shipment Unit Cost").isInt({min: 0}),
    body('cogs.manufacturingCountry', "Invalid Manufacturing Country").isIn(countries.countries.map(country => country.name)),
    function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const errors = validationResult(req);
        console.log(req.body);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array().map(error => error.msg)});
        }
        helperFunc.updateProductInDB(req.body, res);
    });



f