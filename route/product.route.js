import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
} from "../controller/product.controller.js";
import roleMiddleware from "../middlewere/role.middlewere.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";

const router = express.Router();



router.route("/listproducts").get(getAllProducts);

// protected routes

router
  .route("/createproduct")
  .post(JWTauthentication, roleMiddleware(["SELLER", "ADMIN"]), createProduct);

router
  .route("/editproduct/:id")
  .post(JWTauthentication, roleMiddleware(["SELLER", "ADMIN"]), editProduct);

router
  .route("/deleteproduct/:id")
  .post(JWTauthentication, roleMiddleware(["SELLER", "ADMIN"]), deleteProduct);

export default router;
