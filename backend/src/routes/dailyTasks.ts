import { Router } from "express";
import { DailyTasksModel } from "../models";
import mongoose from "mongoose";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

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

router.get("/", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const tasks = await DailyTasksModel.find({ userId: req.user.uid });
    return res.json(tasks || []);
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown";
    return res.status(500).json({
      error: `Failed to fetch DailyTasks for user: ${userName}, ${error}`,
    });
  }
})

router.post("/add-task", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { name, date, status, description, tasks } = req.body;

    const newTask = await DailyTasksModel.create({
      name,
      date,
      status,
      description,
      userId: req.user.uid,
      tasks,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
