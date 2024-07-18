import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./utils/dbConnect.js";
import route from "./route/user.route.js";

dotenv.config();

const PORT = process.env.PORT || 400;
const app = express();

app.use(express.json());

app.use(cors());

app.use(route);

dbConnect();

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
