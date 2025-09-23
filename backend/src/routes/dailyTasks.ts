import { Router } from "express"
import { DailyTasksModel } from "../models"
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware"
import { format, parseISO } from "date-fns"
import { Status } from "../models/table-model"

const router = Router()

function recalcDailyTaskStatus(parentTask: any) {
  if (!parentTask.tasks || parentTask.tasks.length === 0) {
    return Status.NEW
  }

  const hasInProgress = parentTask.tasks.some((t: any) => t.status === Status.IN_PROGRESS)
  const allCompleted = parentTask.tasks.every((t: any) => t.status === Status.COMPLETED)

  if (hasInProgress) return Status.IN_PROGRESS
  if (allCompleted) return Status.COMPLETED
  return Status.NEW
} // to move from here


router.post("/", async (req, res) => {
  try {
    const dailyTask = new DailyTasksModel(req.body)
    const savedTask = await dailyTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    console.error("Error saving DailyTask:", error)
    res.status(400).json({
      error: "Failed to create DailyTask",
      details: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

router.get("/", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const tasks = await DailyTasksModel.find({ userId: req.user.uid })
    return res.json(tasks || [])
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to fetch DailyTasks for user: ${userName}, ${error}`,
    })
  }
})

router.post("/add-task", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })

    const { name, date, status, description, tasks } = req.body
    const parsedDate = parseISO(date)
    const formattedName = format(parsedDate, 'dd-MM-yy')
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date value")
    }

    const existingTask = await DailyTasksModel.findOne({
      name: `${name} - ${formattedName}`,
      userId: req.user.uid
    })

    if (existingTask) {
      return res.status(400).json({ error: "A task with this name already exists for current day." })
    }

    const newTask = await DailyTasksModel.create({
      name: `${name} - ${formattedName}`,
      date,
      status: status,
      description,
      userId: req.user.uid,
      tasks: tasks || [],
    })

    res.status(201).json(newTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.post("/edit-task", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })

    const { taskId, taskData } = req.body
    if (!taskId || !taskData) {
      return res.status(400).json({ error: "taskId and taskData are required" })
    }

    const updatedTask = await DailyTasksModel.findOneAndUpdate(
      { _id: taskId, userId: req.user.uid },
      { $set: taskData },
      { new: true }
    )

    if (!updatedTask) return res.status(404).json({ error: "Task not found" })

    res.status(200).json(updatedTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.post("/delete-task", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })

    const { taskId } = req.body
    if (!taskId) {
      return res.status(400).json({ error: "taskId and taskData are required" })
    }

    const deletedTask = await DailyTasksModel.deleteOne({ _id: taskId, userId: req.user.uid })

    if (!deletedTask) return res.status(404).json({ error: "Task not found" })

    res.status(200).json('Task deleted successfully')
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.post("/add-sub-task", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })

    const { parentTaskId, taskData } = req.body

    if (!parentTaskId || !taskData) {
      return res.status(400).json({ error: "Parent task ID and task data are required" })
    }

    const parentTask = await DailyTasksModel.findOne({
      _id: parentTaskId,
      userId: req.user.uid
    })

    if (!parentTask) {
      return res.status(404).json({ error: "Parent task not found" })
    }

    const duplicate = parentTask.tasks.find(
      (t: any) =>
        t.task_name === taskData.task_name &&
        t.start_date === taskData.start_date
    )

    if (duplicate) {
      return res.status(400).json({ error: "A subtask with this name already exists for this parent task and date." })
    }

    await DailyTasksModel.findByIdAndUpdate(
      parentTaskId,
      { $push: { tasks: taskData } },
      { new: true }
    )
    parentTask.status = recalcDailyTaskStatus(parentTask)
    res.status(201).json(parentTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.post("/edit-sub-task", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })

    const { subTaskId, taskData } = req.body
    if (!subTaskId || !taskData) {
      return res.status(400).json({ error: "subTaskId and taskData are required" })
    }

    const parentTask = await DailyTasksModel.findOne({
      "tasks._id": subTaskId,
      userId: req.user.uid,
    })

    if (!parentTask) return res.status(404).json({ error: "Parent task not found" })

    const updatedTasks = parentTask.tasks.map((t: any) =>
      t._id.toString() === subTaskId ? { ...t.toObject(), ...taskData } : t
    )

    parentTask.tasks = updatedTasks
    parentTask.status = recalcDailyTaskStatus(parentTask)
    await parentTask.save()

    res.status(200).json(parentTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.post("/delete-sub-task", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })

    const { subTaskId } = req.body
    if (!subTaskId) {
      return res.status(400).json({ error: "subTaskId is required" })
    }

    const parentTask = await DailyTasksModel.findOne({
      "tasks._id": subTaskId,
      userId: req.user.uid,
    })

    if (!parentTask) return res.status(404).json({ error: "Parent task not found" })

    parentTask.tasks = parentTask.tasks.filter(
      (t: any) => t._id.toString() !== subTaskId
    )

    parentTask.status = recalcDailyTaskStatus(parentTask)

    await parentTask.save()

    res.status(200).json('Task deleted successfully')
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})



export default router
