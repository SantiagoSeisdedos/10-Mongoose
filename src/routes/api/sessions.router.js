import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authorization.js";
import passport from "passport";

export const sessionsRouter = Router();

sessionsRouter.post(
  "/",
  passport.authenticate("localLogin", {
    failWithError: true,
  }),
  async (req, res, next) => {
    return res
      .status(201)
      .json({ status: "success", message: "Login successful!" });
  },
  (err, req, res, next) => {
    return res.status(401).json({
      status: "error",
      message: err.message || "Login failed: Invalid credentials",
    });
  }
);

sessionsRouter.get("/current", isAuthenticated, (req, res) => {
  return res.json(req.user);
});

sessionsRouter.delete("/current", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: "logout error",
        message: err,
      });
    }
    return res.json({ status: "success", message: "logout OK" });
  });
});
