const productList = document.getElementById("productList");
const validMemberMessage = document.getElementById("validMemberMessage");
const initialize = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lastAttemptedUsername = urlParams.get("lastAttemptedUsername");
  if (lastAttemptedUsername) {
    validMemberMessage.textContent = `Intentaste iniciar sesión como: ${lastAttemptedUsername}. Intenta con tu nombre, o uno de los siguientes: "admin", "santi", "jose", "tutor", "marian", "Jose Mariano"`;
  }

  const fetchProducts = async (url) => {
    const response = await fetch(url);

    if (response.status === 403) {
      alert("No autorizado!");
      return (window.location.href = "/login");
    }
    const products = await response.json();
    return products;
  };

  const renderProducts = (products) => {
    productList.innerHTML = "";
    productList.classList.add("product-list");

    if (!products.hasDocuments) {
      const p = document.createElement("p");
      p.innerHTML = products.error || "No se encontraron productos";
      const productsTitle = document.querySelector("h1");
      productsTitle.insertAdjacentElement("afterend", p);
      return;
    }

    for (const product of products.docs) {
      console.log("product: ", product);
      const li = document.createElement("li");
      const productLink = document.createElement("a");
      productLink.textContent = `${product?.title} - $${product?.price}`;
      productLink.href = `/products/${product._id}`; // Agrega un enlace a la vista de detalles del producto
      console.log("productLink ", productLink.href);
      productLink.addEventListener("click", async (event) => {
        event.preventDefault();
        // Código para cargar la vista de detalles del producto
        // Puedes implementar una función para cargar y mostrar los detalles del producto
        window.location.href = productLink.href;
      });
      li.appendChild(productLink);
      productList?.appendChild(li);
    }

    const currentPage = document.createElement("p");
    currentPage.textContent = `Page ${products.page} of ${products.totalPages}`;
    productList?.insertAdjacentElement("afterbegin", currentPage);

    const pagesButtonStyles = {
      display: "inline-block",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      textDecoration: "none",
      border: "1px solid #007bff",
      borderRadius: "5px",
      marginLeft: "10px",
    };

    if (products.prevPage) {
      const prevPageLink = document.createElement("a");
      prevPageLink.classList.add("pagination");
      prevPageLink.href = "#"; // To prevent the default link behavior
      prevPageLink.textContent = "Previous Page";

      for (const style in pagesButtonStyles) {
        prevPageLink.style[style] = pagesButtonStyles[style];
      }

      prevPageLink.addEventListener("click", async (event) => {
        event.preventDefault();
        const updatedProducts = await fetchProducts(
          `/api/products?limit=${products.limit}&page=${products.prevPage}`
        );
        renderProducts(updatedProducts);
      });

      productList?.insertAdjacentElement("afterbegin", prevPageLink);
    }

    if (products.nextPage) {
      const nextPageLink = document.createElement("a");
      nextPageLink.classList.add("pagination");
      nextPageLink.href = "#";
      nextPageLink.textContent = "Next Page";

      for (const style in pagesButtonStyles) {
        nextPageLink.style[style] = pagesButtonStyles[style];
      }

      nextPageLink.addEventListener("click", async (event) => {
        event.preventDefault();
        const updatedProducts = await fetchProducts(
          `/api/products?limit=${products.limit}&page=${products.nextPage}`
        );
        renderProducts(updatedProducts);
      });

      productList?.insertAdjacentElement("afterbegin", nextPageLink);
    }
  };

  // Fetch and render initial products
  const initialProducts = await fetchProducts("/api/products");
  renderProducts(initialProducts);
};

initialize();
