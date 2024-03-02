const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager("./products.json")

const products = []
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProduct()
        if (limit) {
            res.json(products.slice(0,limit));
        } else {
            res.json(products)
        }
    } catch (error) {
        res.status(500).json({error: "internal server error"})
    }
})

router.get("/:pid", async (req, res) => {
     const id = req.params.pid;

    try {
        const product = await productManager.getProductById (parseInt(id));
        if (!product) {
            return res.json({error: "ID not found"});
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({error:"Interal server error"})
    }
})

router.post("/", (req, res) => {
    
    const newProduct = req.body;

    const postProduct = productManager.addProduct (newProduct)

    console.log(newProduct);

    products.push(newProduct);
    
    res.send({status:"succes", message: "Product added correctly"});
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const  updatedProduct = req.body;

    try {
        await productManager.updatedProduct(parseInt(id), updatedProduct)
        res.json ({
            message: "Product updated succesfully"
        });
    } catch (error) {
        res.status(500).json ({
            error: "Internal server error"
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(parseInt(id));
        
        res.json ({
            message: "Product deleted succesfully"
        });
    } catch (error) {
        res.status(500).json ({
            error: "Internal server error"
        });
    }
});

module.exports = router;
