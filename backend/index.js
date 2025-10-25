import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Task from "./models/task.js"; // renamed to Task (since model name = "Task")

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connection established");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

// ✅ Routes
app.get("/", (req, res) => res.send("🚀 Server is running..."));

// ➕ Add a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    const newTask = new Task({ title, dueDate });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
});

// 📋 Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// 🗑️ Delete a task (optional)
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

// ✅ Save Payment Record
app.post("/api/payments/save", async (req, res) => {
  try {
    const { item, totalAmount, sharers, splitAmount } = req.body;
    const newPayment = new Payment({
      item,
      totalAmount,
      sharers,
      splitAmount,
      saved: true
    });
    await newPayment.save();
    res.status(201).json({ message: "✅ Payment saved", payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: "Error saving payment", error });
  }
});
app.post("/api/payments/calc", async (req, res) => {
  try {
    const { item, totalAmount, sharers } = req.body;
    if (!item || !totalAmount || !sharers)
      return res.status(400).json({ message: "Missing fields" });

    const splitAmount = (totalAmount / sharers).toFixed(2);
    res.status(200).json({
      message: `Each person should pay ₹${splitAmount} for ${item}`,
      item,
      totalAmount,
      sharers,
      splitAmount
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating payment", error });
  }
});

// ✅ Get All Saved Payments
app.get("/api/payments", async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
