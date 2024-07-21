import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      lowercase: true,
      required: true, // Assuming title is required
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      min: 1, // Assuming rating should be between 1 and 5
      max: 5,
    },
    price: {
      type: Number,
      required: true, // Assuming price is required
      min: 0, // Price should be a non-negative number
    },
    stock: {
      type: Number,
      required: true, // Assuming stock is required
      min: 0, // Stock should be a non-negative number
    },
    discountedPrice: {
      type: Number,
      min: 0, // Discounted price should also be a non-negative number
    },
    brand: {
      type: String,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true, // Assuming products are active by default
    },
  },
  {
    timestamps: true, // Corrected spelling of 'timestamps'
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
