const fs = require("fs");

class ProductManager {
    constructor (path) {
        this.path = path;
        this.products = [];
        this.loadProductsFromFile();
    }

    loadProductsFromFile () {
        if (fs.existsSync(this.path)) {
            const content = fs.readFileSync (this.path, 'utf8');
            this.products = JSON.parse(content)
        }
    }

    saveProductToFile () {
        if(fs.existsSync(this.path)) {
            const content = JSON.stringify(this. products, null, 2);
            fs.writeFileSync (this.path, content, "utf8");
        }
    }
    
    addProduct (product) {
        let lastID = this.products.reduce ((max, actualProduct) => actualProduct.id > max ? actualProduct.id : max, 0 );
        product.id = lastID + 1;

        this.products.push (product);

        this.saveProductToFile ();
        return product;
    }

    getProduct () {
        return this.products;
    }

    getProductById (id) {
        return this.products.find (product => product.id === id );
    }

    updatedProduct (id, updatedProduct) {
        const index = this.products.findIndex (product => product.id === id);
        if (index !== -1) {
            this.products [index] = {...this.products [index], ...updatedProduct};
            this.saveProductToFile();
            return this.products[index]; 
        }
        return null;
    }

    deleteProduct (id) {
        const index = this.products.findIndex (product => product.id === id);
        if(index !== -1) {
            this.products.splice(index, 1);
            this.saveProductToFile();
            return true;
        }
        return false
    }
}

module.exports = ProductManager;