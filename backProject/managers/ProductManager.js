import {promises as fs} from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager{
  constructor(filePath){
    this.path = path.resolve(__dirname, '..', filePath);
  }

  async getProducts(){
    try{
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    }catch{
      return [];
    }
  }

  async getProductById(id){
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async addProduct(productData){
    const products = await this.getProducts();
    const newId = products.length > 0 ? products.at(-1).id + 1 : 1;
    const newProduct = {
      id: newId,
      title: productData.title,
      author: productData.author,
      price: productData.price,
      stock: productData.stock,
      category: productData.category,
      thumbnail: productData.thumbnail || []
    }
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null,2));
    return newProduct;
  }

  async updateProduct(id, updates){
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);

    if (index == -1) return {error: 'no se encontro producto'};

    delete updates.id;

    products[index] = {...products[index], ...updates};

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
    
  }

  async deleteProduct(id){
    const products = await this.getProducts();
    const updated = products.filter(p => p.id != id);
    await fs.writeFile(this.path, JSON.stringify(updated,null,2));
    return {message: `producto ${id} eliminado`};
  }

}

export default ProductManager;