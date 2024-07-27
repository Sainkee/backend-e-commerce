import express from "express";

import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
} from "../controller/brand.controller.js";

import upload from "../middlewere/multer.middlewere.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";

const router = express.Router();

router
  .route("/")
  .post(JWTauthentication, upload.single("logo"), createBrand)
  .get(getAllBrands);

router
  .route("/:id")
  .get(getSingleBrand)

  .delete(JWTauthentication, deleteBrand);

export default router;
