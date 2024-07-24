import express from "express";

import {
  addProductIntoCart,
  clearAllCart,
  getCartProduct,
  removeProductFromCart,
  updateCartItem,
} from "../controller/cart.controller.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";

const router = express.Router();
router.use(JWTauthentication);

router.route("/").get(getCartProduct).delete(clearAllCart);

router
  .route("/:id")
  .post(addProductIntoCart)
  .put(updateCartItem)
  .delete(removeProductFromCart);

export default router;
