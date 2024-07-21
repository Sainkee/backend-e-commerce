import express from "express";
import {
  addIntoWishList,
  getAllWishList,
  removeFromWishList,
} from "../controller/wishList.controller.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";

const router = express();
router.get("/", JWTauthentication, getAllWishList);

router
  .post("/:id", JWTauthentication, addIntoWishList)
  .delete("/:id", JWTauthentication, removeFromWishList);

export default router;
