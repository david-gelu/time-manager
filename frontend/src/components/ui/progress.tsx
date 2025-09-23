import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
  value: number
  inProgress?: number
}

function Progress({ className, value, inProgress = 0, ...props }: ProgressProps) {
  const completed = Math.min(value, 100)
  const progress = Math.min(inProgress, 100 - completed)

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      {completed > 0 && (
        <div
          className="absolute left-0 top-0 h-full bg-chart-2 transition-all rounded-full"
          style={{ width: `${completed}%`, zIndex: 4 }}
        />
      )}
      {progress > 0 && (
        <div
          className="absolute top-0 h-full bg-destructive transition-all"
          style={{
            left: completed > 0 ? `calc(${completed}% - 2px)` : '0%', // Doar 1px suprapunere
            width: completed > 0 ? `calc(${progress}% + 1px)` : `${progress}%`, // Doar 1px extensie
            borderRadius: completed > 0 ? '0 9999px 9999px 0' : '9999px', // Colțuri selective
            zIndex: 3
          }}
        />
      )}
    </ProgressPrimitive.Root>
  )
}

export { Progress }