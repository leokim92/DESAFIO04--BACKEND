const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/CartManager")
const cartManager = new CartManager("./cart.json")

const cart = [];

router.post("/", async  (req, res) => {
try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
} catch (error) {
    console.error("Error to create new cart", error);
    res.status(500).json({error: "Internal server error"});
}
});

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    
    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error ("Error to obtain cart", error);
        res.status(500).json ({error: "Internal server error"})
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error ("Error to load product to cart", error);
        res.status(500).json({error: "Internal server error"});
    }
})

module.exports = router;