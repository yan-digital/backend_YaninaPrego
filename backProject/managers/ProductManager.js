import ProductModel from "../models/product.model.js";

class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const filter = {};
if (query) {
  const q = query.toLowerCase();

  if (q === "true" || q === "false") {
    filter.available = q === "true";
  } else {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { author: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ];
  }
}

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
        lean: true,
      };

      const result = await ProductModel.paginate(filter, options);

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}` : null,
        nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}` : null,
      };
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id).lean();
      return product;
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  }

  async addProduct(productData) {
    const { title, author, description, price, category, stock } = productData;
    if (
      !title ||
      !author ||
      !description ||
      price == null ||
      !category ||
      stock == null
    ) {
      throw new Error("Faltan campos obligatorios para agregar el producto");
    }

    const newProduct = await ProductModel.create(productData);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const updated = await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!updated) throw new Error("Producto no encontrado");
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) throw new Error("Producto no encontrado");
    return { message: "Producto eliminado correctamente" };
  }
}

export default ProductManager;
