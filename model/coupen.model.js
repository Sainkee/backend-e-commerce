import mongoose from "mongoose";

const coupenSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "amount"],
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupen = mongoose.model("Coupen", coupenSchema);
export default Coupen;
