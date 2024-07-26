import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./utils/dbConnect.js";
import userRouter from "./route/user.route.js";
import wishListRoute from "./route/wishList.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import coupenRouter from "./route/coupen.route.js";
import orderRouter from "./route/order.route.js";
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
app.use("/api/v1/coupen", coupenRouter);
app.use("/api/v1/order", orderRouter);

dbConnect();

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
