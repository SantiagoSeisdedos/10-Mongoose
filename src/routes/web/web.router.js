import { Router } from "express";
import { upload } from "../../middlewares/saveImage.js";

import { productModel } from "../../dao/models/product.model.js";
import { cartModel } from "../../dao/models/cart.model.js";
import { BASE_URL } from "../../config.js";
import { isAuthenticated } from "../../middlewares/authorization.js";
import { usersRouter } from "./users.router.js";
import { sessionsRouter } from "./sessions.router.js";

export const webRouter = Router();

webRouter.get("/", (req, res) => {
  try {
    return res.render("home.handlebars", { pageTitle: "Home" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error loading home" });
  }
});

webRouter.get("/products", (req, res) => {
  try {
    return res.render("products.handlebars", {
      pageTitle: `Products`,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error loading /products" });
  }
});

webRouter.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) throw new Error("Product ID is required");

    const product = await productModel.findById(productId).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
      // O podrías renderizar una vista de "producto no encontrado"
    }
    return res.render("productDetails.handlebars", {
      product,
      baseUrl: BASE_URL + "/",
      pageTitle: `Producto ${product.title}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error loading /products/:id" });
  }
});

webRouter.get("/realTimeProducts", (req, res) => {
  try {
    console.log("Cliente conectado al realtime!");
    return res.render("realTimeProducts.handlebars", {
      pageTitle: "Real Time Products",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error loading /realTimeProducts" });
  }
});

webRouter.get("/chat", (req, res) => {
  try {
    console.log("Cliente conectado al chat!");
    return res.render("chat.handlebars", { pageTitle: "Chat" });
  } catch (error) {
    console.log("route CHAT error: ", error);
    return res.status(500).json({ message: "Error loading /chat" });
  }
});

webRouter.get("/images", (req, res) => {
  try {
    res.render("images.handlebars", { pageTitle: "Images" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error loading /images" });
  }
});

webRouter.post("/images", upload.single("image"), (req, res) => {
  try {
    if (req.file.filename) res.json({ url: req.file.filename });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error uploading /image" });
  }
});

webRouter.get("/carts/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    if (!cartId) throw new Error("cartId ID is required");

    const cart = await cartModel.findById(cartId).lean();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
      // O podrías renderizar una vista de "producto no encontrado"
    }
    return res.render("cartDetails.handlebars", {
      pageTitle: `Cart ${cartId}`,
      cart,
      baseUrl: BASE_URL + "/",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error loading /carts/:id" });
  }
});

// AUTH
webRouter.use(sessionsRouter);
webRouter.use(usersRouter);
