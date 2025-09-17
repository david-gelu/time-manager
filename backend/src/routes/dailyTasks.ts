import { Router } from "express";
import { DailyTasksModel } from "../models";
import mongoose from "mongoose";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const dailyTask = new DailyTasksModel(req.body);
    const savedTask = await dailyTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error saving DailyTask:", error);
    res.status(400).json({
      error: "Failed to create DailyTask",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await DailyTasksModel.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch DailyTasks" });
  }
});

router.get('/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected');
    }

    const collections = await mongoose.connection.db.listCollections().toArray();

    res.json({
      message: 'Backend is connected',
      mongoStatus: 'Connected',
      collectionsCount: collections.length
    });
  } catch (error) {
    console.error('Error fetching MongoDB stats:', error);
    res.status(500).json({
      error: 'Failed to fetch MongoDB stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
