const express = require('express');
const router = express.Router();
const helperFunctions = require("../utils/helperFunctions");

/* GET products JSON. */
router.get('/', function (req, res) {
    try {
        // just to handle No 'Access-Control-Allow-Origin' header is present on the requested resource.
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(helperFunctions.readProductsJson());
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;
