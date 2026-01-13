import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import path from "path";
import session from "express-session";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

app.engine("handlebars", engine({
  helpers: {
    multiply: (a, b) => a * b,
    eq: (a, b) => a === b,
    cartTotal: (products) => {
      if (!Array.isArray(products)) return 0;
      return products.reduce(
        (acc, item) => acc + (item.product.price * item.quantity), 0
      );
    },
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "views"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error MongoDB:", err));

app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});

const io = new Server(server);

app.set("io", io);
