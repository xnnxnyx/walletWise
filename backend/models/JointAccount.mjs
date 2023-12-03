import mongoose from "mongoose";

const JASchema = new mongoose.Schema({
  user1: { type: String, required: true },
  user2: { type: String, required: true },
});

// Create a unique compound index on user1 and user2
JASchema.index({ user1: 1, user2: 1 }, { unique: true });

const JA = mongoose.model("JAColl", JASchema);

export default JA;
