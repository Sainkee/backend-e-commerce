import User from "../model/user.model.js";
import customError from "../utils/error.js";



export const getAllWishList = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      throw new customError("user not found", 404);
    }
    const updatedUser = await User.findById(userId).populate("wishList");
    res.status(200).json({
      message: "wishlist fetched successfully",
      wishlist: updatedUser.wishList,
    });
  } catch (error) {
    next(error);
  }
};

export const addIntoWishList = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const user = req.user;
    if (!user) {
      throw new customError("user not found", 404);
    }
    await user.addToWishList(productId);

    const updatedUser = await User.findById(user._id).populate("wishList");
    res.status(200).json({
      message: "product added into wishlist",
      wishlist: updatedUser.wishList,
    });
  } catch (error) {
    next(error);
  }
};
export const removeFromWishList = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const user = req.user;
    await user.removeToWishList(productId);
    const updatedUser = await User.findById(user._id).populate("wishList");
    res.status(200).json({
      message: "product removed from wishlist",
      wishlist: updatedUser.wishList,
    });
  } catch (error) {
    next(error);
  }
};
