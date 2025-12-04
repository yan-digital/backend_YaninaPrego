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
      return [];
    }
  }

  async createCart(){
    const carts = await this.getCarts();
    const newId = carts.length > 0 ? carts.at(-1).id + 1 : 1;

    const newCart = {
      id: newId,
      products: [],
    }

    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id){
    const carts = await this.getCarts();
    return carts.find(c => c.id == id);
  }

  async addProductsToCart(cartId, productId){
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id == cartId);

    if(!cart) return {error: 'carrito no encontrado'}

    const existingProduct = cart.products.find(p => p.product == productId)
    if(existingProduct){
      existingProduct.quantity +=1;      
    }else{
      cart.products.push({product: productId, quantity: 1});
    }
    await fs.writeFile(this.path, JSON.stringify(carts,null,2));
    return cart;
  }


}

export default cartManager;