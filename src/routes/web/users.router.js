import { Router } from "express";

export const usersRouter = Router();

usersRouter.get("/register", (req, res) => {
  try {
    return res.render("register.handlebars", { pageTitle: "Register" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error loading /register" });
  }
});

usersRouter.get("/resetPassword", (req, res) => {
  try {
    return res.render("resetPassword.handlebars", {
      pageTitle: "Reset Password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error loading /resetPassword" });
  }
});

usersRouter.get("/profile", (req, res) => {
  try {
    return res.render("profile.handlebars", {
      pageTitle: "Profile",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error loading /profile" });
  }
});
