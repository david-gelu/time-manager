import { format } from "date-fns"
import { DailyTasks, Status, SubTask } from "./models/table-model"

export function replaceDateKeepTime(isoString: string, newDate: Date) {
  const [, time] = isoString.split("T")
  const yyyy = newDate.getFullYear()
  const mm = String(newDate.getMonth() + 1).padStart(2, "0")
  const dd = String(newDate.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${time}`
}

export const dateFormat = (date: string) => {
  const currentDate = new Date();
  const splitCurrentDate = currentDate.toISOString().split('T')
  const parsedDate = date.split('T')
  const formattedNameDate = format(currentDate, 'dd-MM-yy')
  const joindDate = splitCurrentDate[0] + 'T' + parsedDate[1]
  return { joindDate, formattedNameDate }
}

export const recalcDailyTaskStatus = (parentTask: DailyTasks) => {
  if (!parentTask.tasks || parentTask.tasks.length === 0) return Status.NEW

  const allCompleted = parentTask.tasks.every((t: SubTask) => t.status === Status.COMPLETED)
  const hasInProgressOrCompleted = parentTask.tasks.some((t: any) =>
    t.status === Status.IN_PROGRESS || t.status === Status.COMPLETED
  )

  if (allCompleted) return Status.COMPLETED
  if (hasInProgressOrCompleted) return Status.IN_PROGRESS
  return Status.NEW
}