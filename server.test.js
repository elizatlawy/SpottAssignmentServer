const server = require('./app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);
const helperFunc = require("./utils/helperFunctions");

let DBCopy;
let exampleProduct;
beforeEach(() => {
     DBCopy = helperFunc.readProductsJson();
    exampleProduct = helperFunc.readProductsJson()[0];

});

afterEach(() => {
    helperFunc.writeProductsJson(DBCopy);
});

describe("GET /products tests", () => {
    test("should respond with a 200 status code", async () => {
        const response = await requestWithSupertest.get("/products").send()
        expect(response.statusCode).toBe(200)
    })
    test("response should specify json in the content type header", async () => {
        const response = await requestWithSupertest.get("/products").send()
        expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    })
    test("body should Be Defined  ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        expect(response.body[0]).toBeDefined()
    })
    test("each product should have id  ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product).toHaveProperty('id');
        });
    })
    test("id should be alphanumeric ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.id).toMatch(/^[a-zA-Z0-9]+$/);
        });
    })
    test("response should have productName  ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product).toHaveProperty('productName');
        });
    })
    test("response should have productName not empty  ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.productName.length).toBeGreaterThanOrEqual(1);
        });
    })
    test("body should have cogs ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product).toHaveProperty('cogs');
        });
    })
    test("cogs should have unitManufacturingCost ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.cogs).toHaveProperty('unitManufacturingCost');
        });
    })
    test("unitManufacturingCost should be greater than or equal 0 ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.cogs.unitManufacturingCost).toBeGreaterThanOrEqual(0);
        });
    })
    test("cogs should have shipmentUnitCost ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.cogs).toHaveProperty('shipmentUnitCost');
        });
    })
    test("shipmentUnitCost should be greater than or equal 0 ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.cogs.shipmentUnitCost).toBeGreaterThanOrEqual(0);
        });
    })
    test("cogs should have monthlyAdvertismentCost ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.cogs).toHaveProperty('monthlyAdvertismentCost');
        });
    })
    test("monthlyAdvertismentCost should be greater than or equal 0 ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.cogs.monthlyAdvertismentCost).toBeGreaterThanOrEqual(0);
        });
    })
    test("cogs should have manufacturingCountry ", async () => {
        const response = await requestWithSupertest.get("/products").send()
        response.body.forEach((product) => {
            expect(product.cogs).toHaveProperty('manufacturingCountry');
        });
    })
})

describe("POST /cogs tests", () => {
    describe("given a valid product", () => {
        test("should respond with a status code of 200 ", async () => {
            const response = await requestWithSupertest.post("/cogs").send(exampleProduct)
            expect(response.statusCode).toBe(200)
        })
        // with a real DB I would test every cogs filed to see that ot is updates in the DB as expected
        test("should update new product unitManufacturingCost ", async () => {
            const oldProduct = helperFunc.readProductsJson()[0]
             await requestWithSupertest.post("/cogs").send(
                {
                    "id": "B08QPPGNNZ",
                    "productName": "MediChair Kneeling Chair",
                    "cogs": {
                        "unitManufacturingCost": oldProduct.cogs.unitManufacturingCost + 1,
                        "shipmentUnitCost": "5000",
                        "monthlyAdvertismentCost": "5000",
                        "manufacturingCountry": "Togo"
                    }
                }
            )
            const newProduct = helperFunc.readProductsJson()[0]
            expect(newProduct.cogs.unitManufacturingCost).toBe(oldProduct.cogs.unitManufacturingCost + 1)
        })
        describe("given invalid product", () => {
            test("should respond with a status code of 400 ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "junk": 'junk'
                    }
                )
                expect(response.statusCode).toBe(400)
            })
            test("given empty product id ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "id": "",
                        "productName": "MediChair Kneeling Chair",
                        "cogs": {
                            "unitManufacturingCost": "0.3",
                            "shipmentUnitCost": "5000",
                            "monthlyAdvertismentCost": "5000",
                            "manufacturingCountry": "Togo"
                        }
                    }
                )
                expect(response.statusCode).toBe(400)
                expect(response.body).toStrictEqual(
                    {"errors": ["Invalid Product id"]}
                )
            })
            test("given empty product productName ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "id": "B08QPPGNNZ",
                        "productName": "",
                        "cogs": {
                            "unitManufacturingCost": "0.3",
                            "shipmentUnitCost": "5000",
                            "monthlyAdvertismentCost": "5000",
                            "manufacturingCountry": "Togo"
                        }
                    }
                )
                expect(response.statusCode).toBe(400)
                expect(response.body).toStrictEqual(
                    {"errors": ["Product Name cannot be empty or missing"]}
                )
            })
            test("given missing product productName ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "id": "B08QPPGNNZ",
                        "cogs": {
                            "unitManufacturingCost": "0.3",
                            "shipmentUnitCost": "5000",
                            "monthlyAdvertismentCost": "5000",
                            "manufacturingCountry": "Togo"
                        }
                    }
                )
                expect(response.statusCode).toBe(400)
                expect(response.body).toStrictEqual(
                    {"errors": ["Product Name cannot be empty or missing"]}
                )
            })
            // on a real product I would test various invalid types of inputs
            test("given Invalid unitManufacturingCost ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "id": "B08QPPGNNZ",
                        "productName": "MediChair Kneeling Chair",
                        "cogs": {
                            "unitManufacturingCost": "-0.3",
                            "shipmentUnitCost": "5000",
                            "monthlyAdvertismentCost": "5000",
                            "manufacturingCountry": "Togo"
                        }
                    }
                )
                expect(response.statusCode).toBe(400)
                expect(response.body).toStrictEqual(
                    {"errors": ["Invalid Unit Manufacturing Cost"]}
                )
            })
            test("given Invalid shipmentUnitCost ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "id": "B08QPPGNNZ",
                        "productName": "MediChair Kneeling Chair",
                        "cogs": {
                            "unitManufacturingCost": "0.3",
                            "shipmentUnitCost": "Invalid",
                            "monthlyAdvertismentCost": "5000",
                            "manufacturingCountry": "Togo"
                        }
                    }
                )
                expect(response.statusCode).toBe(400)
                expect(response.body).toStrictEqual(
                    {"errors": ["Invalid Shipment Unit Cost"]}
                )
            })
            test("given Invalid monthlyAdvertismentCost ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "id": "B08QPPGNNZ",
                        "productName": "MediChair Kneeling Chair",
                        "cogs": {
                            "unitManufacturingCost": "0.3",
                            "shipmentUnitCost": "5000",
                            "monthlyAdvertismentCost": "-5000",
                            "manufacturingCountry": "Togo"
                        }
                    }
                )
                expect(response.statusCode).toBe(400)
                expect(response.body).toStrictEqual(
                    {"errors": ["Invalid monthly Advertisement Cost"]}
                )
            })
            test("given Invalid manufacturingCountry ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "id": "B08QPPGNNZ",
                        "productName": "MediChair Kneeling Chair",
                        "cogs": {
                            "unitManufacturingCost": "0.3",
                            "shipmentUnitCost": "5000",
                            "monthlyAdvertismentCost": "5000",
                            "manufacturingCountry": "FakeCountry"
                        }
                    }
                )
                expect(response.statusCode).toBe(400)
                expect(response.body).toStrictEqual(
                    {"errors": ["Invalid Manufacturing Country"]}
                )
            })
            test("given multiple Invalid fields ", async () => {
                const response = await requestWithSupertest.post("/cogs").send(
                    {
                        "id": "",
                        "productName": "",
                        "cogs": {
                            "unitManufacturingCost": "-0.3",
                            "shipmentUnitCost": "-5000",
                            "monthlyAdvertismentCost": "-5000",
                            "manufacturingCountry": "FakeCountry"
                        }
                    }
                )
                expect(response.statusCode).toBe(400)
                expect(response.body).toStrictEqual(
                    {"errors": ["Invalid Product id",
                            "Invalid Unit Manufacturing Cost",
                            "Invalid Shipment Unit Cost",
                            "Invalid monthly Advertisement Cost",
                            "Invalid Manufacturing Country"
                        ]}
                )
            })
        })
    }) // describe
})
