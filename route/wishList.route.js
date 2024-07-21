import express from "express";
import {
  addIntoWishList,
  getAllWishList,
  removeFromWishList,
} from "../controller/wishList.controller.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";

const router = express();

router.route("/").get(JWTauthentication, getAllWishList);
router.route("/createwishList/:id").get(JWTauthentication, addIntoWishList);
router
  .route("/removewishlistitem/:id")
  .get(JWTauthentication, removeFromWishList);

export default router;
