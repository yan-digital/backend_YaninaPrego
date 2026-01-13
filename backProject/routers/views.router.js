import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const pm = new ProductManager();
const cm = new CartManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await pm.getProducts({ limit, page, sort, query });

    if (!req.session.cartId) {
      const newCart = await cm.createCart();
      req.session.cartId = newCart._id.toString();
    }
    res.render("index", {
      products: result.payload,
      pagination: result,
      cartId: req.session.cartId,
      query,
    });
  } catch (error) {
    res.status(500).send("Error al obtener los productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await pm.getProductById(req.params.pid);

    if (!req.session.cartId) {
      const newCart = await cm.createCart();
      req.session.cartId = newCart._id.toString();
    }
    res.render("productDetail", {
      product,
      cartId: req.session.cartId,
    });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    const newCart = await cm.createCart();
    req.session.cartId = newCart._id.toString();
  }
  res.redirect(`/cart/${req.session.cartId}`);
});

router.get("/cart/:cid", async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    res.render("cart", { cart, cartId: req.params.cid });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

export default router;
