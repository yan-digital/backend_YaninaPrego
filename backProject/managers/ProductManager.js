
import {promises as fs} from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager{
  constructor(filePath){
    this.path = path.resolve(__dirname, '..', filePath);
  }
  
    async save(products){
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
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
    const { title, author, price, stock, category } = productData;
    if(!title || !author || price == null || stock == null || !category){
      return {error: 'Faltan campos obligatorios'};
    } 

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if(parsedPrice <=0 || parsedStock <= 0 || isNaN(parsedPrice) || isNaN(parsedStock)){
        return {error: 'El precio y el stock deben ser numeros mayores que cero'};
    }

    const products = await this.getProducts();
    const newId = products.length > 0 ? products.at(-1).id + 1 : 1;
    const newProduct = {
      id: newId,
      title: productData.title,
      author: productData.author,
      price: parsedPrice,
      stock: parsedStock,
      category: productData.category,
      thumbnail: productData.thumbnail || []
    }
    try{
      products.push(newProduct);
      await this.save(products);
      return newProduct;
    } catch(err){
      return {error: 'no se pudo guardar el producto'};
    }
  }

  async updateProduct(id, updates){
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);

    if (index == -1) return {error: 'no se encontro producto'};

    delete updates.id;

    const allowedFields = ['title', 'author', 'price', 'stock', 'category', 'thumbnail'];

    Object.keys(updates).forEach(key => {
      if (!allowedFields.includes(key)) delete updates[key];
    });

    products[index] = {...products[index], ...updates};

    try{
      await this.save(products);
      return products[index];
    }catch(err){
      return {error: 'no se pudo actualizar el producto'};
    } 
  }

  async deleteProduct(id){
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id != id);

    if(filtered.length === products.length){
      return {error: 'no se encontro producto'};
    }

    try{
      await this.save(filtered);
      return {message: `producto ${id} eliminado`};
    }catch(err){
      return {error: 'no se pudo eliminar el producto'};
    }
  }
}

export default ProductManager;