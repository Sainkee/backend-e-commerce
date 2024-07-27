import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./utils/dbConnect.js";
import userRouter from "./route/user.route.js";
import wishListRoute from "./route/wishList.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import couponRouter from "./route/coupon.route.js";
import orderRouter from "./route/order.route.js";
import brandRouter from "./route/brand.route.js";
import addressRouter from "./route/address.route.js";
import errorHandlingMiddleware from "./middlewere/errorMiddleware.js";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = process.env.PORT || 400;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/wishlist", wishListRoute);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/brand", brandRouter);

dbConnect();

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
