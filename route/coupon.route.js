import express from "express";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";
import {
  createCoupon,
  getAllActiveCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
} from "../controller/coupon.controller.js";

const router = express.Router();

router.route("/createCoupon").post(JWTauthentication, createCoupon);

router.route("/active").get(getAllActiveCoupon);

router.route("/").get(getAllCoupons);

router
  .route("/:id")
  .get(getCouponById)
  .put(JWTauthentication, updateCoupon)
  .delete(JWTauthentication, deleteCoupon);

export default router;
