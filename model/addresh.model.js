import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    type: { type: String, enum: ["BILLING", "SHIPPING"], required: true },
  },
  { timestamps: true }
);
const Address = mongoose.model("Addresh", addressSchema);
export default Address;
