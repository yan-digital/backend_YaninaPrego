import {Router} from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

const productManager = new ProductManager('./src/data/product.json');

router.get('/', async(req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:id', async(req, res) => {
  const pid = req.params.id;
  const product = await productManager.getProductById(pid);
  product ? res.json(product) : res.status(404).json({error: 'elemento no encontrado'});
});

router.post('/', async(req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct)
});

router.put('/:pid', async(req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body)
  res.json(updated);
});

router.delete('/:pid', async(req, res) => {
  const result = await productManager.deleteProduct(req.params.pid);
  res.json(result);
});

export default router;