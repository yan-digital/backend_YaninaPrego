import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await pm.getProducts({ limit, page, sort, query });
    res.json({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await pm.addProduct(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const result = await pm.deleteProduct(req.params.pid);
    res.json({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

export default router;
