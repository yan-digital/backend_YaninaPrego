import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();

const cartManager = new CartManager('./src/data/carts.json');

router.post('/', async(req, res) =>{
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', async(req, res) =>{
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid);
  if(cart){
    res.json(cart.products);
  }else{
    res.status(404).json({error: 'el carrito no se encuentra'});
  }
});

router.post('/:cid/product/:pid', async(req, res) =>{
  const {cid, pid} = req.params;
  const result = await cartManager.addProductCart(cid, pid);
  res.json(result);
});

export default router;