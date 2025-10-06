import { Router } from "express"
import { AuthRequest } from "../middleware/authMiddleware"
import { DailyTasksModel } from "../models"
import { Status } from "../models/table-model"

const router = Router()

router.get("/count-daily-status-new", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  try {
    const countDailysWithStatusNew = await DailyTasksModel.countDocuments({ status: Status.NEW, userId: req.user.uid })
    return res.json(countDailysWithStatusNew || 0)
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to count dailys with status ${Status.NEW} for user: ${userName}, ${error}`,
    })
  }
})

router.get("/count-daily-status-in-progress", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  try {
    const countDailysWithStatusInProgress = await DailyTasksModel.countDocuments({ status: Status.IN_PROGRESS, userId: req.user.uid })
    return res.json(countDailysWithStatusInProgress || 0)
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to count dailys with status ${Status.IN_PROGRESS} for user: ${userName}, ${error}`,
    })
  }
})

router.get("/count-daily-status-completed", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  try {
    const countDailysWithStatusCompleted = await DailyTasksModel.countDocuments({ status: Status.COMPLETED, userId: req.user.uid })
    return res.json(countDailysWithStatusCompleted || 0)
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to count dailys with status ${Status.COMPLETED} for user: ${userName}, ${error}`,
    })
  }
})

router.get("/count-subtasks-status-new", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const result = await DailyTasksModel.aggregate([
      { $match: { userId: req.user.uid } },
      { $unwind: "$tasks" },
      { $match: { "tasks.status": Status.NEW } },
      { $count: "totalNewSubtasks" }
    ])

    const totalNewSubtasks = result[0]?.totalNewSubtasks || 0

    return res.json(totalNewSubtasks)
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to count subtasks with status ${Status.NEW} for user: ${userName}, ${error}`,
    })
  }
})


router.get("/count-subtasks-status-in-progress", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const result = await DailyTasksModel.aggregate([
      { $match: { userId: req.user.uid } },
      { $unwind: "$tasks" },
      { $match: { "tasks.status": Status.IN_PROGRESS } },
      { $count: "totalInProgressSubtasks" }
    ])

    const totalInProgressSubtasks = result[0]?.totalInProgressSubtasks || 0

    return res.json(totalInProgressSubtasks)
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to count subtasks with status ${Status.IN_PROGRESS} for user: ${userName}, ${error}`,
    })
  }
})

router.get("/count-subtasks-status-completed", async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const result = await DailyTasksModel.aggregate([
      { $match: { userId: req.user.uid } },
      { $unwind: "$tasks" },
      { $match: { "tasks.status": Status.COMPLETED } },
      { $count: "totalCompletedSubtasks" }
    ])

    const totalCompletedSubtasks = result[0]?.totalCompletedSubtasks || 0

    return res.json(totalCompletedSubtasks)
  } catch (error) {
    const userName = req.user?.name || req.user?.email || "Unknown"
    return res.status(500).json({
      error: `Failed to count subtasks with status ${Status.COMPLETED} for user: ${userName}, ${error}`,
    })
  }
})

export default router