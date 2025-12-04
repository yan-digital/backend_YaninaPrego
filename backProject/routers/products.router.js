import {Router} from 'express';
import ProductManager from '../managers/ProductManager.js';
import { io } from '../server.js';

const router = Router();

const productManager = new ProductManager('data/product.json');

router.post('/', async (req,res)=>{
  const newProduct = await productManager.addProduct(req.body);
  io.emit('productosActualizados');
  res.status(201).json(newProduct);
});

router.delete('/:pid', async (req,res)=>{
  const result = await productManager.deleteProduct(req.params.pid);
  io.emit('productosActualizados');
  res.json(result);
});

export default router;