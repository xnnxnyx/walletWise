// models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  total_amount: { type: Number, required: true },
  monthly_income: { type: Number, required: true },
  lastModified: { type: Date, default: Date.now },
});

const User = mongoose.model("UserColl", userSchema);

export default User;
