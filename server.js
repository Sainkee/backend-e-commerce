import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./utils/dbConnect.js";
import router from "./route/user.route.js";
import errorHandlingMiddleware from "./middlewere/errorMiddleware.js";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = process.env.PORT || 400;
const app = express();

app.use(express.json());

app.use(cors());

app.use(cookieParser())

app.use("/api/v1/users", router);

dbConnect();

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
