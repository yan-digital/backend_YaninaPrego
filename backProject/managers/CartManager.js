import { CartModel } from "../models/cart.model.js";

class CartManager{

  async createCart(){
    const newCart = await CartModel.create({ products: [] });
    return newCart;
  }

  async getCartById(cid){
    const cart = await CartModel
    .findById(cid)
    .populate('products.product')
    .lean();
    if(!cart){
      throw new Error('Carrito no encontrado');
    }
    return cart;
  }

  async addProductsToCart(cid, pid){
    const cart = await CartModel.findById(cid);
    if(!cart){
      throw new Error('Carrito no encontrado');
    }
    const productIndex = cart.products.findIndex(p=> p.product.toString() === pid);
    if(productIndex !== -1){
      cart.products[productIndex].quantity += 1;
    }else{
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cid, pid){
    const cart = await CartModel.findById(cid);
    if(!cart){
      throw new Error('Carrito no encontrado');
    }

    const originalLength = cart.products.length;

    cart.products = cart.products.filter(p=> p.product.toString() !== pid);
    if(cart.products.length === originalLength){
      throw new Error('Producto no encontrado en el carrito');
    }
    await cart.save();
    return cart;
  }

  async updateCart(cid, products){
    const cart = await CartModel.findById(cid);
    if(!cart){
      throw new Error('Carrito no encontrado');
    }
    cart.products = products;
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity){
    const cart = await CartModel.findById(cid);
    if(!cart){
      throw new Error('Carrito no encontrado');
    }
    const product = cart.products.find(p=> p.product.toString() === pid);
    if(!product){
      throw new Error('Producto no encontrado en el carrito');
    }
    if (quantity <= 0){
      throw new Error('La cantidad debe ser mayor que cero');
    }
    await cart.save();
    return cart;
  }

  async clearCart(cid){
    const cart = await CartModel.findById(cid);
    if(!cart){
      throw new Error('Carrito no encontrado');
    }
    cart.products = [];
    await cart.save();
    return cart;
  }
}

export default CartManager;