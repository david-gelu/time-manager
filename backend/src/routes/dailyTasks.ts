import { Router } from "express";
import { DailyTasksModel } from "../models";
import mongoose from "mongoose";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import { format, parseISO } from "date-fns";

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
    const parsedDate = parseISO(date);
    const formattedName = format(parsedDate, 'dd-MM-yy');
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date value");
    }

    const existingTask = await DailyTasksModel.findOne({
      name: `${name} - ${formattedName}`,
      userId: req.user.uid
    });

    if (existingTask) {
      return res.status(400).json({ error: "A task with this name already exists for current day." });
    }



    const newTask = await DailyTasksModel.create({
      name: `${name} - ${formattedName}`,
      date,
      status: status,
      description,
      userId: req.user.uid,
      tasks: tasks || [],
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/add-sub-task", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { parentTaskId, taskData } = req.body;

    if (!parentTaskId || !taskData) {
      return res.status(400).json({ error: "Parent task ID and task data are required" });
    }

    const parentTask = await DailyTasksModel.findOne({
      _id: parentTaskId,
      userId: req.user.uid
    });

    if (!parentTask) {
      return res.status(404).json({ error: "Parent task not found" });
    }

    // Optional: verificare sub-task duplicat după task_name și start_date
    const duplicate = parentTask.tasks.find(
      (t: any) =>
        t.task_name === taskData.task_name &&
        t.start_date === taskData.start_date
    );

    if (duplicate) {
      return res.status(400).json({ error: "A subtask with this name already exists for this parent task and date." });
    }

    // parentTask.tasks.push(taskData);
    // await parentTask.save();
    await DailyTasksModel.findByIdAndUpdate(
      parentTaskId,
      { $push: { tasks: taskData } },
      { new: true }
    )

    res.status(201).json(parentTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
