import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager("./backProject/data/products.json");

router.get('/', async (req, res) => {
  const products = await pm.getProducts();
  res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) =>{
  res.render('realTimeProducts');
});

export default router;
