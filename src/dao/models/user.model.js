import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { areHashesEqual } from "../../utils/crypto.js";

const collection = "users";

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  {
    strict: "throw",
    versionKey: false,
    statics: {
      login: async function (email, password) {
        let userData;

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          userData = {
            email: "admin",
            name: "admin",
            lastName: "admin",
            rol: "admin",
          };
        } else {
          const user = await mongoose
            .model(collection)
            .findOne({ email })
            .lean();

          if (!user) {
            throw new Error("Login failed: Invalid credentials");
          }

          if (!areHashesEqual(password, user["password"])) {
            throw new Error("Login failed: Invalid credentials");
          }

          userData = {
            email: user["email"],
            name: user["name"],
            lastname: user["lastname"],
            rol: "user",
          };
        }
        return userData;
      },
    },
  }
);

export const userModel = mongoose.model(collection, schema);
