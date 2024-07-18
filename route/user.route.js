import express from "express";
import { registerUser } from "../controller/user.controller.js";

const route = express.Router();

route.post("/register",registerUser)

export default route