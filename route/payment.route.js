import express from "express";

import {
  checkout,
  createPaymentIntent,
} from "../controller/payment.controller.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";

const router = express.Router();

router.post("/create-payment-intent", JWTauthentication, createPaymentIntent);
router.post("/checkout", JWTauthentication, checkout);

export default router;
