import { Router } from "express";

export const sessionsRouter = Router();

sessionsRouter.get("/login", (req, res) => {
  try {
    return res.render("login.handlebars", { pageTitle: "Login" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error loading /login" });
  }
});
