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

router.route("/").get(getAllProducts);

// protected routes

router
  .route("/")
  .post(JWTauthentication, roleMiddleware(["SELLER", "ADMIN"]), createProduct);

router
  .route("/:id")
  .put(JWTauthentication, roleMiddleware(["SELLER", "ADMIN"]), editProduct)
  .delete(
    JWTauthentication,
    roleMiddleware(["SELLER", "ADMIN"]),
    deleteProduct
  );

export default router;
