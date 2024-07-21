import Product from "../model/product.model.js";
import customError from "../utils/error.js";
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      rating,
      price,
      stock,
      discountedPrice,
      brand,
      category,
      image,
      thumbnail,
      isActive,
    } = req.body;

    if (!price || !stock || !title) {
      throw new customError("Title, price, and stock are required fields", 400);
    }

    const savedProduct = new Product({
      title,
      description,
      rating,
      price,
      stock,
      discountedPrice,
      brand,
      category,
      image,
      thumbnail,
      isActive,
    });

    await Product.create(savedProduct);

    return res
      .status(201)
      .json({ message: "product added successfully", product: savedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    await Product.findByIdAndUpdate(productId, { $set: { isActive: false } });

    return res.status(201).json({ message: "product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const editProduct = {
      title: req.body.title,
      description: req.body.description,
      rating: req.body.rating,
      price: req.body.price,
      stock: req.body.stock,
      discountedPrice: req.body.discountedPrice,
      brand: req.body.brand,
      category: req.body.category,
      image: req.body.image,
      thumbnail: req.body.thumbnail,
      isActive: req.body.isActive,
    };

    Object.keys(editProduct).forEach(
      (key) => editProduct[key] === undefined && delete editProduct[key]
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      editProduct,
      {
        runValidators: true,
        new: true,
      }
    );

    if (!updatedProduct) {
      throw new customError("product not found", 404);
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res) => {
  const pagination = +req.query.pagination || 1;
  const limit = +req.query.limit || 10;
  const skip = (pagination - 1) * limit;
  const sorting = req.query.sort === "ASC" ? 1 : -1;

  const query = {};

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  if (req.query.minPrice) {
    query.price = { ...query.price, $gte: +req.query.minPrice };
  }

  if (req.query.maxPrice) {
    query.price = { ...query.price, $lte: +req.query.maxPrice };
  }

  if (req.query.minRating) {
    query.rating = { ...query.rating, $gte: +req.query.minRating };
  }

  if (req.query.maxRating) {
    query.rating = { ...query.rating, $lte: +req.query.maxRating };
  }

  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === "true";
  }
  const totalPage = Math.ceil((await Product.countDocuments()) / limit);

  const products = await Product.find(query)
    .limit(limit)
    .skip(skip)
    .sort({ price: sorting });

  res.json({ products, totalPage });
};
