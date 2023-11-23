import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "userType"
  },
  userType: {
    type: String,
    required: true,
    enum: ["UserColl", "JA"]
  }
});

budgetSchema.virtual("user", {
  ref: function (doc) {
    return doc.userType;
  },
  localField: "userRef",
  foreignField: "_id",
  justOne: true
});

const Budget = mongoose.model("BudgetColl", budgetSchema);

export default Budget;

