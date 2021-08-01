var express = require('express');
var router = express.Router();
const helperFunctions = require("./helperFunctions");



/* GET products JSON. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    let products = helperFunctions.readProductsJson();
    res.send(products);
});

module.exports = router;
