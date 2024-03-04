console.log("connected");

const socket = io();

const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  addProduct();
});

socket.on("products", (data) => {
  const listaProductos = document.getElementById("productsList");
  listaProductos.innerHTML = "";
  data.forEach((products) => {
    listaProductos.innerHTML += `
    <div class='product-card'>
    <h3>Titulo : ${products.title}</h3>
    <p>Descripción : ${products.description}</p>
    <p>$${products.price}</p>
    <button class='deleteButton'>Eliminar</button>
    </div>
    `;
  });

  const deleteButtons = document.querySelectorAll(".deleteButton");
  deleteButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      deleteProduct(data[index].id);
    });
  });
});

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

const addProduct = () => {

  const title = document.getElementById("form-title").value;
  const state = document.getElementById("form-select").value === "true"; 
  const category = document.getElementById("form-category").value;
  const description = document.getElementById("form-description").value;
  const price = parseFloat(document.getElementById("form-price").value);
  const code = document.getElementById("form-code").value;
  const stock = parseInt(document.getElementById("form-stock").value);

  
  if (
    title &&
    state !== undefined &&
    category &&
    description &&
    price &&
    code &&
    stock !== undefined
  ) {
   
    const product = {
      title,
      state,
      category,
      description,
      price,
      code,
      stock,
    };

    socket.emit("addProduct", product);
  } else {
    console.error("Complete all field to upload new product");
  }
};
