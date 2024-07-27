import express from "express";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";
import {
  addOrUpdateAddress,
  deleteAddress,
  getUserAddresses,
} from "../controller/address.controller.js";

const router = express.Router();
router.use(JWTauthentication);

router.post("/", addOrUpdateAddress);
router.delete("/:addressId", deleteAddress);
router.get("/", getUserAddresses);

export default router;
