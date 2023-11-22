import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserColl", required: true },
  content: { type: String, required: true },
  category: { type: String },
  date: { type: Date, default: Date.now },
});

const Notification = mongoose.model("NotificationColl", notificationSchema);

export default Notification;
