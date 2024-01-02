import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import { BASE_URL, MONGODB_URL } from "./config.js";
import {
  injectSocketServer,
  onConnection,
} from "./sockets/socket.controller.js";
import { sessions } from "./middlewares/sessions.js";
import { apiRouter } from "./routes/api/api.router.js";
import { webRouter } from "./routes/web/web.router.js";
import { passportInitialize, passportSession } from "./middlewares/authentication.js";

const app = express();

const server = app.listen(8080, async () => {
  const DB_STATUS = await mongoose.connect(MONGODB_URL);
  if (DB_STATUS) console.log(`Base de datos en linea! Conectado: ${BASE_URL}`);
});

app.engine("handlebars", handlebars.engine());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions);
app.use(passportInitialize, passportSession);

// Socket.io
const webSocketServer = new Server(server);

// Websocket server
webSocketServer.on("connection", onConnection(webSocketServer));
app.use(injectSocketServer(webSocketServer));

// Public files
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.static("static"));

// routers
app.use("/", webRouter);
app.use("/api", apiRouter);

// 03:10:00 (clase 11)
