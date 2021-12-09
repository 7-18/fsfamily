import mongoose from "mongoose";

const dreamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "users" },
  name: String,
  description: String,
  DreamStatus: String,
  imageUrl: String,
  registerDate: { type: Date, default: Date.now },
});

const dream = mongoose.model("dreams", dreamSchema);
export default dream;
