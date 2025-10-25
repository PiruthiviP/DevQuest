import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: Date,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
