import mongoose from "mongoose";

const UpcomingPaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserColl", required: true },
  frequency: { type: String, required: true },
  category: { type: String },
  amount: { type: Number, required: true },
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date, required: true },
});

const UpcomingPayment = mongoose.model("UpcomingPaymentColl", UpcomingPaymentSchema);

export default UpcomingPayment;
