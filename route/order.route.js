import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrder,
  getSingleOrder,
  updateOrder,
} from "../controller/order.controller.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";

const router = express.Router();

router.use(JWTauthentication);

router.route("/").post(createOrder).get(getAllOrder);

router.route("/:id").delete(deleteOrder).get(getSingleOrder).put(updateOrder);

export default router;
