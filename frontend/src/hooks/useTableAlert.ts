import { useEffect, useRef } from "react"
import { type Task, Status } from "@/types"


const useFaviconBlink = (shouldBlink: boolean, alertFavicon: string, normalFavicon: string) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
    if (!link) return

    if (shouldBlink) {
      let visible = true
      intervalRef.current = setInterval(() => {
        link.href = visible ? alertFavicon : normalFavicon
        visible = !visible
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      link.href = normalFavicon
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (link) link.href = normalFavicon
    }
  }, [shouldBlink, alertFavicon, normalFavicon])
}

const useTabAlertForTasks = (tasks: Task[]) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const originalTitle = useRef(document.title)

  const normalFavicon = "/vite.svg"
  const alertFavicon = "/favicon-alert.ico"

  const hasUrgent = tasks.some(task => {
    if (!task.start_date || !task.end_date || task.status === Status.COMPLETED) return false

    const startDate = new Date(task.start_date).getTime()
    const endDate = new Date(task.end_date).getTime()
    if (isNaN(startDate) || isNaN(endDate) || endDate <= startDate) return false

    const now = Date.now()
    if (now < startDate || now > endDate) return false

    const total = endDate - startDate
    const elapsed = now - startDate
    const percentage = (elapsed / total) * 100

    return percentage >= 90
  })

  useEffect(() => {
    if (hasUrgent) {
      let visible = true
      intervalRef.current = setInterval(() => {
        document.title = visible ? "Task aproape expirat!" : originalTitle.current
        visible = !visible
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      document.title = originalTitle.current
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      document.title = originalTitle.current
    }
  }, [hasUrgent])

  // Blink favicon
  useFaviconBlink(hasUrgent, alertFavicon, normalFavicon)
}
export default useTabAlertForTasks
