import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controller/user.controller.js";
import { varifyjwt } from "../middlewere/auth.middlewere.js";

const router = express.Router();

// router.post("/register",registerUser)

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-access").post(refreshAccessToken);
router.route("/logout").post(varifyjwt, logoutUser);

export default router;
