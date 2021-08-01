var express = require('express');

var router = express.Router();
require('express-validator');
const {request} = require("express");
const helperFunctions = require("./helperFunctions");
const {validate} = require("./cogs");
const {body, validationResult} = require("express-validator");

/* POST update product costs JSON. */
router.post('/',
    body('id', 'Invalid Product id').exists().isAlphanumeric(),
    body('cogs', 'Invalid cogs data').exists().isEmpty(),
    body('cogs.unitManufacturingCost', "Invalid Unit Manufacturing Cost ").isInt({min: 0}),
    function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const errors = validationResult(req);
        const productToUpdate = req.body;
        console.log(productToUpdate);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        let productsJson = helperFunctions.readProductsJson();
        let productIndex = findProductIndex(productsJson, productToUpdate.id);
        if (productIndex === -1) {
            res.status(400).send({
                message: 'Product id does not exist'
            });
        } else {
            productsJson[productIndex] = productToUpdate;
            helperFunctions.writeProductsJson(productsJson);
            res.sendStatus(200);
        }
        //
        // if (!productToUpdate.id) {
        //     res.status(400).send({
        //         message: 'Missing Product id'
        //     });
        // } else if (!productToUpdate.cogs) {
        //     res.status(400).send({
        //         message: 'Invalid cogs data'
        //     });
        // } else if (productToUpdate.cogs.unitManufacturingCost < 0 || productToUpdate.cogs.shipmentUnitCost < 0 || productToUpdate.cogs.monthlyAdvertismentCost < 0) {
        //     res.status(400).send({
        //         message: 'Cost cannot be negative'
        //     });
        // } else {
        //     let productsJson = helperFunctions.readProductsJson();
        //     let productIndex = findProductIndex(productsJson, productToUpdate.id);
        //     if (productIndex === -1) {
        //         res.status(400).send({
        //             message: 'Product id does not exist'
        //         });
        //     } else {
        //         productsJson[productIndex] = productToUpdate;
        //         helperFunctions.writeProductsJson(productsJson);
        //         res.sendStatus(200);
        //     }
        // }
    });

module.exports = router;



function findProductIndex(products, id) {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.id === id)
            return i;
    }
    return -1;
}
