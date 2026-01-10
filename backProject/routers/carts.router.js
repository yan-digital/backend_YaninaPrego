import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();

const cartManager = new CartManager();

// Crear un nuevo carrito
router.post('/', async(req, res) =>{
  try{
    const newCart = await cartManager.createCart();
    res.status(201).json({status: 'succes', payload: newCart});
  }catch(error){
    res.status(404).json({status: 'error', message: error.message});
  }
});

//Obtiene un carrito con productos por su id
router.get('/:cid', async(req, res) =>{
  try{
    const cart = await cartManager.getCartById(req.params.cid);
    res.json({status: 'succes', payload: cart});
  }catch(error){
    res.status(404).json({status: 'error', message: error.message});
  }
});

//Agregar un producto o sumar cantidad
router.post('/:cid/products/:pid', async(req, res) =>{
  try{
    const cart = await cartManager.addProductsToCart(req.params.cid, req.params.pid);
    res.json({status: 'succes', payload: cart});
  }catch(error){
    res.status(404).json({status: 'error', message: error.message});
  }
});

//Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async(req, res) =>{
  try{
    const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    res.json({status: 'succes', payload: cart});
  }catch(error){
    res.status(404).json({status: 'error', message: error.message});
  }
});

//Reemplazar productos del carrito
router.put('/:cid', async(req, res) =>{
  try{
    const cart = await cartManager.updateCart(req.params.cid, req.body.products);
    res.json({status: 'succes', payload: cart});
  }catch(error){
    res.status(404).json({status: 'error', message: error.message});
  }
});

//Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async(req, res) =>{
  try{
    const { quantity } = req.body;
    const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    res.json({status: 'succes', payload: cart});
  }catch(error){
    res.status(404).json({status: 'error', message: error.message});
  }
});

//Vaciar el carrito
router.delete('/:cid', async(req, res) =>{
  try{
    const cart = await cartManager.clearCart(req.params.cid, []);
    res.json({status: 'succes', payload: cart});
  }catch(error){
    res.status(404).json({status: 'error', message: error.message});
  }
});

export default router;