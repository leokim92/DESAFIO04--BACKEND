const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastId = 0;

        this.uploadCart();
    }

    async uploadCart() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.lastId = Math.max (...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error to save cart from file", error);

            await this.saveCart();
        }
    }


    async saveCart () {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart () {
        const newCart = {
            id: ++this.lastId,
            products: []
        };

        this.carts.push(newCart);

        await this.saveCart();
        return newCart;
    }

    async getCartById (cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                throw new Error (`ID ${cartId} cart doesn't exist`)
            }

            return cart;
        } catch (error) {
            console.error("Error to optain cart by ID", error);
            throw error;
        }
    }

    async addProductToCart (cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const existProduct = cart.products.find( p => p.product === productId);

        if (existProduct) {
            existProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCart();
        return cart;
    }
}

module.exports = CartManager;