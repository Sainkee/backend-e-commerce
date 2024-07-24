import User from "../model/user.model.js";
import customError from "../utils/error.js";

export const addProductIntoCart = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new customError("User not found", 404);
    }
    await user.addToCart(productId, next);

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    next(error);
  }
};
export const removeProductFromCart = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new customError("User not found", 404);
    }

    await user.removeToCart(cartItemId, next);

    return res
      .status(200)
      .json({ message: "Product removed from cart successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCartProduct = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new customError("User not found", 404);
    }

    const cart = await user.getCart(next);

    res.status(200).json({ message: "cart fetched  successfully", cart });
  } catch (error) {
    next(error);
  }
};

export const clearAllCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new customError("User not found", 404);
    }

    const cart = await user.clearCart(next);

    res.status(200).json({ message: "cart cleard  successfully", cart });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  const productId = req.params.id;
  const { quantity } = req.body;
  try {
    const userId = req.user._id;

    if (!userId) {
      throw new customError("user not found", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new customError("User not found", 404);
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      throw new customError("Invalid quantity", 400);
    }

    const cart = await user.updateCartItemQuantity(productId, quantity, next);

    res.status(200).json({ message: "cart updated successfully", cart });
  } catch (error) {
    next(error);
  }
};
