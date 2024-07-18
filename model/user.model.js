import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    fullName: { type: String, required: true, trim: true },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
