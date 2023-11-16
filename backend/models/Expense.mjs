// models/expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserColl", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.model("ExpenseColl", expenseSchema);

export default Expense;
