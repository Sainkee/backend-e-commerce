import Coupon from "../model/coupon.model.js";
import customError from "../utils/error.js";

// Utility function to check if a date is in the past
const dateIsPast = (givenDate) => {
  const inputDate = new Date(givenDate);
  const currentDate = new Date();
  return inputDate < currentDate;
};

// Create a new coupon
export const createCoupon = async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const { code, expirationDate, discountType, discountValue } = req.body;

  try {
    if (!(userRole === "SELLER" || userRole === "ADMIN")) {
      throw new customError("Unauthorized request", 400);
    }

    if (!code || !discountType || !discountValue || !expirationDate) {
      throw new customError("Missing required fields", 400);
    }

    if (dateIsPast(expirationDate)) {
      throw new customError(
        "Please provide a valid date. Select a future date.",
        400
      );
    }

    if (!["percentage", "amount"].includes(discountType)) {
      throw new customError("Invalid discount type", 400);
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      throw new customError("Coupon code already exists", 400);
    }

    const newCoupon = {
      expirationDate,
      discountType,
      discountValue,
      code,
      createdBy: userId,
    };

    const savedCoupon = await Coupon.create(newCoupon);

    res
      .status(200)
      .json({ message: "Coupon created successfully", savedCoupon });
  } catch (error) {
    next(error);
  }
};

// Get all active coupons
export const getAllActiveCoupon = async (req, res, next) => {
  try {
    const allCoupons = await Coupon.find({ isActive: true });

    return res.json(allCoupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch active coupons" });
  }
};

// Get a specific coupon by ID
export const getCouponById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new customError("Coupon not found", 404);
    }

    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
};

// Update a coupon
export const updateCoupon = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;
  const { expirationDate, discountType, discountValue } = req.body;

  try {
    if (!(userRole === "SELLER" || userRole === "ADMIN")) {
      throw new customError("Unauthorized request", 400);
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new customError("Coupon not found", 404);
    }

    if (dateIsPast(expirationDate)) {
      throw new customError(
        "Please provide a valid date. Select a future date.",
        400
      );
    }

    if (!["percentage", "amount"].includes(discountType)) {
      throw new customError("Invalid discount type", 400);
    }

    coupon.expirationDate = expirationDate;
    coupon.discountType = discountType;
    coupon.discountValue = discountValue;
    coupon.updatedBy = userId;

    const updatedCoupon = await coupon.save();

    res
      .status(200)
      .json({ message: "Coupon updated successfully", updatedCoupon });
  } catch (error) {
    next(error);
  }
};

// Delete a coupon
export const deleteCoupon = async (req, res, next) => {
  const { id } = req.params;
  const userRole = req.user.role;

  try {
    if (!(userRole === "SELLER" || userRole === "ADMIN")) {
      throw new customError("Unauthorized request", 400);
    }

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw new customError("Coupon not found", 404);
    }

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const allCoupons = await Coupon.find();

    return res.json(allCoupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
};
