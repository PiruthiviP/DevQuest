import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  item: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  sharers: { type: Number, required: true },
  splitAmount: { type: Number },
  saved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
