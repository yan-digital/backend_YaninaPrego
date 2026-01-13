import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json({ status: "success", payload: cart });
});

router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  res.json({ status: "success", payload: cart });
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;

  const cart = await cartManager.addProductsToCart(
    req.params.cid,
    req.params.pid,
    quantity
  );

  req.app.get("io").emit("cartUpdated", {
    cid: req.params.cid,
    cart,
  });

  res.json({ status: "success" });
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cart = await cartManager.removeProductFromCart(
    req.params.cid,
    req.params.pid
  );

  req.app.get("io").emit("cartUpdated", {
    cid: req.params.cid,
    cart,
  });

  res.json({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
  const cart = await cartManager.clearCart(req.params.cid);

  req.app.get("io").emit("cartUpdated", {
    cid: req.params.cid,
    cart,
  });

  res.json({ status: "success" });
});

export default router;
