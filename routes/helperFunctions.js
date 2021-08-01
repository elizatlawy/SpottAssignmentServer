const fs = require("fs");

function readProductsJson() {
    let rawData = fs.readFileSync('products.json');
    return JSON.parse(rawData);
}

function writeProductsJson(productsJson) {
    let data = JSON.stringify(productsJson, null, 2);
    fs.writeFileSync('products.json', data);
}


function findProductIndex(products, id) {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.id === id)
            return i;
    }
    return -1;
}

function updateProductInDB(prodToUpdate, res) {
    let productsJson = readProductsJson();
    let productIndex = findProductIndex(productsJson, prodToUpdate.id);
    if (productIndex === -1) {
        return res.status(400).send({"errors": ["Product does not exist in DB"]});
    }
    productsJson[productIndex] = prodToUpdate;
    writeProductsJson(productsJson)
    res.sendStatus(200);
}


exports.updateProductInDB = updateProductInDB;
exports.findProductIndex = findProductIndex;
exports.readProductsJson = readProductsJson;
exports.writeProductsJson = writeProductsJson;