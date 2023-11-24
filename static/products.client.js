const form = document.querySelector("form");
const productList = document.getElementById("productList");

const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await fetch("/images", {
      method: "POST",
      body: formData,
    });

    const { url } = await response.json();
    if (url) {
      return url;
    } else {
      throw new Error("No se ha recibido la URL de la imagen");
    }
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
    alert("Ocurrió un error al cargar la imagen");
  }
};

const validMembers = [
  "admin",
  "santi",
  "jose",
  "tutor",
  "marian",
  "Jose Mariano",
];

// Enter username
Swal.fire({
  title: "Bienvenido!",
  input: "text",
  confirmButtonText: "Entrar",
  showLoaderOnConfirm: false,
  allowOutsideClick: false,
}).then((result) => {
  if (!result.value) {
    Swal.fire({
      title: "Error!",
      text: "Debes ingresar un nombre de usuario",
      icon: "error",
      confirmButtonText: "Ok",
    }).then(() => {
      window.location.href = "/";
    });
  } else if (validMembers.includes(result.value.toLowerCase())) {
    Swal.fire({
      title: `Bienvenido ${result.value}`,
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    updateHeader(result.value);
    sendProductData(result.value);
  } else {
    Swal.fire({
      title: "Error!",
      text: "No estás autorizado para ingresar",
      icon: "error",
      confirmButtonText: "Ok",
    }).then(() => {
      window.location.href = `/?lastAttemptedUsername=${result.value}`;
      // window.location.href = "/";
    });
  }
});

const updateHeader = (username) => {
  const productHeader = document.getElementById("productHeader");
  if (productHeader) {
    productHeader.textContent = `Listado de Productos - ${username}`;
  }
};

const sendProductData = async (username) => {
  const socket = io({
    auth: {
      username,
    },
  });
  console.log("Cliente conectado");
  // send message/product
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtén los valores de los campos del formulario dentro del evento submit
    const title = document.getElementById("productTitle").value;
    const description = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value;
    const code = document.getElementById("productCode").value;
    const status = document.getElementById("productStatus").checked; // Para checkbox
    const stock = document.getElementById("productStock").value;
    const category = document.getElementById("productCategory").value;
    const imageFile = document.getElementById("productImage").files[0];
    const thumbnail = [];

    // Validations
    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category ||
      !imageFile
    ) {
      Swal.fire({
        title: "Error!",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    const url = await uploadImage(imageFile);
    thumbnail.push(url);

    socket.emit(
      "addProduct",
      title,
      description,
      price,
      code,
      stock,
      status,
      category,
      thumbnail
    );
    form.reset();
  });

  // User Conected
  socket.on("new-user", (username) => {
    Swal.fire({
      text: `Bienvenido ${username}`,
      toast: true,
      position: "top-right",
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  });

  // User Disconected
  socket.on("user-disconnected", (username) => {
    Swal.fire({
      text: `Te vamos a extrañar ${username}! Esperamos que vuelvas pronto`,
      toast: true,
      position: "top-right",
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  });

  socket.on("getProducts", (products) => {
    productList.innerHTML = "";
    for (const product of products) {
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      const img = document.createElement("img");
      img.src = product.thumbnail;
      img.alt = product.title;
      img.width = 100;
      img.height = 100;
      img.addEventListener("click", () => {
        window.open(`${product.thumbnail}`, "_blank");
      });

      img.addEventListener("mouseover", () => {
        img.style.cursor = "pointer";
      });

      const title = document.createElement("p");
      title.textContent = product.title;

      const price = document.createElement("p");
      price.textContent = `${product.price}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.addEventListener("click", () => {
        Swal.fire({
          title: "Confirmación",
          text: "¿Estás seguro que quieres eliminar este producto? Esta acción no puede revertirse",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            const productId = product.id;
            socket.emit("deleteProduct", productId);
          }
        });
      });

      productItem.appendChild(img);
      productItem.appendChild(title);
      productItem.appendChild(price);
      productItem.appendChild(deleteButton);

      productList.appendChild(productItem);
    }
  });
};
