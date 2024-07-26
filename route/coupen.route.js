import express from "express";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";
import {
  createCoupen,
  getAllActiveCoupen,
  getCoupenById,
  updateCoupen,
  deleteCoupen,
  getAllCoupons,
} from "../controller/coupen.controller.js";

const router = express.Router();

router.route("/createCoupen").post(JWTauthentication, createCoupen);

router.route("/active").get(getAllActiveCoupen);

router.route("/").get(getAllCoupons);

router
  .route("/:id")
  .get(getCoupenById)
  .put(JWTauthentication, updateCoupen)
  .delete(JWTauthentication, deleteCoupen);

export default router;
