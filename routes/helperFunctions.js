
const fs = require("fs");

function readProductsJson(){
    let rawData = fs.readFileSync('products.json');
    return JSON.parse(rawData);
}

function writeProductsJson(productsJson){
    let data = JSON.stringify(productsJson,null,2);
    fs.writeFileSync('products.json',data);
}


exports.readProductsJson = readProductsJson;
exports.writeProductsJson = writeProductsJson;