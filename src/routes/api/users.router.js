import { Router } from "express";
import { userModel } from "../../dao/models/user.model.js";
import { hashPassword } from "../../utils/crypto.js";
import { isAuthenticated } from "../../middlewares/authorization.js";

export const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  try {
    req.body.password = hashPassword(req.body.password);
    const user = await userModel.create(req.body);

    req.login(user.toObject(), (error) => {
      if (error) {
        return res
          .status(401)
          .json({ message: error.message || error, status: "error" });
      } else {
        return res.status(201).json({
          payload: user.toObject(),
          message: "Usuario creado",
          status: "success",
        });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message || error, status: "error" });
  }
});

usersRouter.put("/", async (req, res) => {
  try {
    req.body.password = hashPassword(req.body.password);
    const updatedUser = await userModel.updateOne(
      { email: req.body.email },
      { $set: { password: req.body.password } },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      payload: updatedUser,
      message: "Usuario actualizado",
      status: "success",
    });
  } catch (error) {
    res.status(400).json({ message: error.message || error, status: "error" });
  }
});

usersRouter.get("/current", isAuthenticated, async (req, res) => {
  const user = await userModel
    .findOne({ email: req["user"].email }, { password: 0 })
    .lean();
  res.json({ status: "success", payload: user });
});
