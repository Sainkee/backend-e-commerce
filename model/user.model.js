import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    fullName: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["CUSTOMER", "SELLER", "ADMIN"],
    },
    wishList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compareSync(password, this.password);
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: process.env.REFRESH_EXPIRY }
  );
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_EXPIRY,
    }
  );
};

userSchema.methods.addToWishList = async function (ProductId) {
  if (!this.wishList.includes(ProductId)) {
    this.wishList.push(ProductId);
    await this.save();
  }
};
userSchema.methods.removeToWishList = async function (ProductId) {
  if (this.wishList.includes(ProductId)) {
    this.wishList = this.wishList.filter(
      (id) => id.toString() !== ProductId.toString()
    );
    await this.save();
  }
};

const User = mongoose.model("User", userSchema);

export default User;
