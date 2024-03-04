const express = require("express");
const exphbs = require("express-handlebars")
const app = express();
const PORT = 8080;
const productsRouter = require("./routes/products.router");
const cartRouter = require("./routes/cart.router");
const socketIO = require("socket.io")
const viewsRouter = require("./routes/views.router")

const ProductManager = require("./controllers/ProductManager");
const productManager = new ProductManager("./products.json");

app.use(express.static("./src/public"));

const httpServer = app.listen(PORT, () => {
    console.log(`Running in port ${PORT}`);
  });

const io = socketIO(httpServer)

app.use("/", viewsRouter);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views")

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

io.on("connection", async (socket) => {
    console.log("A client has connected");

    const products = await productManager.getProduct();
 
    socket.emit("products", products);
    
    socket.on("deleteProduct", async (id) => {

      await productManager.deleteProduct(id);

      const products = await productManager.getProduct();

      io.sockets.emit("products", products);
    });
  
    socket.on("addProduct", async (product) => {
      try {

        await productManager.addProduct(product);

        const products = await productManager.getProduct();

        io.sockets.emit("products", products);
      } catch (error) {
        console.log("Error al cargar producto");
      }
    });
  });
