import { error } from 'console';
import {promises as fs} from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class cartManager{
  constructor(filePath){
    this.path = path.resolve(__dirname, '..', filePath);
  }

  async getCarts(){
    try{
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    }catch{
      return [ ];
    }
  }

  async saveCarts(carts){
    try{
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch(err){
      return {error: 'no se pudo guardar el carrito'};
    }
  }

  async createCart(){
    const carts = await this.getCarts();
    if(!Array.isArray(carts)){
      return {error: 'Formato no valido'};
    }
    const newId = 
      carts.length > 0 && typeof carts.at(-1).id == 'number' ? carts.at(-1).id + 1: 1;

    const newCart = {
      id: newId,
      products: [],
    }

    carts.push(newCart);
    const result = await this.saveCarts(carts);
    if (result?.error) return result;
    return newCart;
  }

  async getCartById(id){
    const carts = await this.getCarts();
    return carts.find(c => c.id == id);
  }

  async addProductsToCart(cartId, productId){
    cartId = Number(cartId);
    productId = Number(productId);

    if(isNaN(cartId) || isNaN(productId)){
      return {error: 'ID invalido'};
    } 

    const carts = await this.getCarts();
    const cart = carts.find(c => c.id == cartId);

    if(!cart) return {error: 'carrito no encontrado'}

    const existingProduct = cart.products.find(p => p.productId == productId)
    if(existingProduct){
      existingProduct.quantity +=1;      
    }else{
      cart.products.push({productId, quantity: 1});
    }
    const result = await this.saveCarts(carts);
    if (result?.error) return result;
    return cart;
  }

  async removeProductFromCart(cartId, productId){
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id == cartId);

    if(!cart) return {error: 'carrito no encontrado'}

    const index = cart.products.findIndex(p => p.productId == productId);
    if(index === -1) return {error: 'producto no encontrado en el carrito'}

    cart.products.splice(index, 1);
    const result = await this.saveCarts(carts);
    if (result?.error) return result;
    return cart;
  }


}

export default cartManager;