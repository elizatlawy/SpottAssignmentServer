const express = require('express');
const router = express.Router();
const helperFunctions = require("./helperFunctions");


/* GET products JSON. */
router.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(helperFunctions.readProductsJson());
});

module.exports = router;
