import { Router } from "express"
import { AuthRequest } from "../middleware/authMiddleware"
import { DailyTasksModel } from "../models"
import { Status, SubTask } from "../models/table-model"

const router = Router()
export type SubTaskWithParent = SubTask & {
  parentName: string
}

router.get("/all-status-new", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const search = (req.query.search as string) || ""

    const matchStage: any = {
      "tasks.status": Status.NEW,
      userId: req.user.uid
    }

    if (search) {
      matchStage["tasks.task_name"] = { $regex: search, $options: "i" }
    }

    const tasks: SubTaskWithParent[] = await DailyTasksModel.aggregate([
      { $unwind: "$tasks" },
      { $match: matchStage },
      {
        $project: {
          _id: "$tasks._id",
          task_name: "$tasks.task_name",
          status: "$tasks.status",
          start_date: "$tasks.start_date",
          end_date: "$tasks.end_date",
          description: "$tasks.description",
          parentName: "$name",
        },
      },
    ])
    return res.json(tasks || [])
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to fetch subtask with status ${Status.NEW} for user: ${userName}, ${error}`,
    })
  }
})

router.get("/all-status-in-progress", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const search = (req.query.search as string) || ""

    const matchStage: any = {
      "tasks.status": Status.IN_PROGRESS,
      userId: req.user.uid
    }

    if (search) {
      matchStage["tasks.task_name"] = { $regex: search, $options: "i" }
    }

    const tasks: SubTaskWithParent[] = await DailyTasksModel.aggregate([
      { $unwind: "$tasks" },
      { $match: matchStage },
      {
        $project: {
          _id: "$tasks._id",
          task_name: "$tasks.task_name",
          status: "$tasks.status",
          start_date: "$tasks.start_date",
          end_date: "$tasks.end_date",
          description: "$tasks.description",
          parentName: "$name",
        },
      },
    ])
    return res.json(tasks || [])
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to fetch subtask with status ${Status.IN_PROGRESS} for user: ${userName}, ${error}`,
    })
  }
})

router.get("/all-status-completed", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const search = (req.query.search as string) || ""

    const matchStage: any = {
      "tasks.status": Status.COMPLETED,
      userId: req.user.uid
    }

    if (search) {
      matchStage["tasks.task_name"] = { $regex: search, $options: "i" }
    }

    const tasks: SubTaskWithParent[] = await DailyTasksModel.aggregate([
      { $unwind: "$tasks" },
      { $match: matchStage },
      {
        $project: {
          _id: "$tasks._id",
          task_name: "$tasks.task_name",
          status: "$tasks.status",
          start_date: "$tasks.start_date",
          end_date: "$tasks.end_date",
          description: "$tasks.description",
          parentName: "$name",
        },
      },
    ])
    return res.json(tasks || [])
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to fetch subtask with status ${Status.COMPLETED} for user: ${userName}, ${error}`,
    })
  }
})

export default router