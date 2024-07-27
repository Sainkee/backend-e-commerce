import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Cart from "./cart.model.js";
import customError from "../utils/error.js";
import Product from "./product.model.js";
import Address from "./addresh.model.js";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    fullName: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["CUSTOMER", "SELLER", "ADMIN"],
    },
    wishList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],

    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Cart",
      },
    ],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    billingAddresses: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
    shippingAddresses: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compareSync(password, this.password);
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: process.env.REFRESH_EXPIRY }
  );
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_EXPIRY,
    }
  );
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = jwt.sign(
    { _id: this._id },
    process.env.RESET_TOKEN_KEY,
    { expiresIn: process.env.RESET_EXPIRY } // e.g., '1h' for 1 hour
  );

  // Set reset token and expire fields
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + parseInt(60 * 60 * 1000); // Convert to milliseconds

  return resetToken;
};

userSchema.methods.addToWishList = async function (ProductId) {
  if (!this.wishList.includes(ProductId)) {
    this.wishList.push(ProductId);
    await this.save();
  }
};
userSchema.methods.removeToWishList = async function (ProductId) {
  if (this.wishList.includes(ProductId)) {
    this.wishList = this.wishList.filter(
      (id) => id.toString() !== ProductId.toString()
    );
    await this.save();
  }
};

userSchema.methods.addToCart = async function (productId, next) {
  try {
    if (!productId) {
      throw new customError("productId is required ", 400);
    }

    let cart = await Cart.findOne({ user: this._id });
    if (!cart) {
      cart = new Cart({ user: this._id, cartItem: [] });
    }

    const existingItem = cart.cartItem.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.cartItem.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    this.cart = cart._id;
    await this.save();
  } catch (error) {
    next(error);
  }
};

userSchema.methods.removeToCart = async function (cartItemId) {
  try {
    if (!cartItemId) {
      throw new customError("cartItemId is required ", 400);
    }

    let cart = await Cart.findOne({ user: this._id });
    if (!cart) {
      throw new customError("Cart not found", 404);
    }

    if (cart.cartItem.length === 0) {
      throw new customError("Cart is empty", 400);
    }
    const filteredcart = cart.cartItem.filter(
      (item) => item._id.toString() !== cartItemId.toString()
    );

    cart.cartItem = filteredcart;
    await cart.save();
  } catch (error) {
    throw new customError("product not found", 400);
  }
};

userSchema.methods.clearCart = async function (next) {
  try {
    let cart = await Cart.findOne({ user: this._id });
    if (!cart) {
      throw new customError("Cart not found", 404);
    }

    cart.cartItem = [];
    await cart.save();
    return cart;
  } catch (error) {
    next(error);
  }
};

userSchema.methods.getCart = async function (next) {
  try {
    let cart = await Cart.findOne({ user: this._id }).populate(
      "cartItem.product"
    );
    if (!cart) {
      throw new customError("Cart not found", 404);
    }

    return cart;
  } catch (error) {
    next(error);
  }
};

userSchema.methods.updateCartItemQuantity = async function (
  productId,
  quantity,
  next
) {
  try {
    if (!productId) {
      throw new customError("productId is required ", 400);
    }

    if (quantity < 1) {
      throw new customError("Quantity must be at least 1", 400);
    }

    let cart = await Cart.findOne({ user: this._id });
    if (!cart) {
      throw new customError("Cart not found", 404);
    }

    const item = cart.cartItem.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (item) {
      item.quantity = quantity;
      await cart.save();
      return cart;
    } else {
      throw new customError("Product not found in cart", 404);
    }
  } catch (error) {
    next(error);
  }
};

const User = mongoose.model("User", userSchema);

export default User;
