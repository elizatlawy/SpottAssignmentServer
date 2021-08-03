const express = require('express');
const router = express.Router();
require('express-validator');
const helperFunc = require("../utils/helperFunctions");
const {body, validationResult} = require("express-validator");
const countries = require('../public/assets/Countries');
module.exports = router;


/* POST update product cogs. */
router.post('/',
    body('id', "Invalid Product id").exists().isAlphanumeric(),
    body('cogs.unitManufacturingCost', "Invalid Unit Manufacturing Cost").isFloat({min: 0}),
    body('cogs.shipmentUnitCost', "Invalid Shipment Unit Cost").isFloat({min: 0}),
    body('cogs.monthlyAdvertismentCost', "Invalid monthly Advertisement Cost").isFloat({min: 0}),
    body('cogs.manufacturingCountry', "Invalid Manufacturing Country").isIn(countries.countries.map(country => country.name)),
    function (req, res) {
        try {
            // just to handle No 'Access-Control-Allow-Origin' header is present on the requested resource.
            res.header("Access-Control-Allow-Origin", "*");
            console.log("Logger: Server received POST request:\n", req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array().map(error => error.msg)});
            }
            helperFunc.updateProductInDB(req.body, res);
        } catch (error) {
            res.sendStatus(500);
        }
    });



