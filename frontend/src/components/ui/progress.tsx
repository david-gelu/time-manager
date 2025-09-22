// import * as ProgressPrimitive from "@radix-ui/react-progress"
// import { cn } from "@/lib/utils"
// import type { ComponentProps } from "react"

// interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
//   value: number
//   inProgress?: number
// }
// function Progress({ className, value, inProgress = 0, ...props }: ProgressProps) {
//   console.log(100 - (value + inProgress || 0))
//   return (
//     <ProgressPrimitive.Root
//       data-slot="progress"
//       className={cn(
//         "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
//         className
//       )}
//       {...props}
//     >
//       <ProgressPrimitive.Indicator
//         data-slot="progress-indicator"
//         className="bg-chart-2 h-full w-full flex-1 transition-all"
//         style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//       />
//       <ProgressPrimitive.Indicator
//         data-slot="progress-indicator"
//         className="bg-destructive h-full w-full flex-1 transition-all"
//         style={{ transform: `translateX(-${100 - (value + inProgress || 0)}%)` }}
//       />
//     </ProgressPrimitive.Root>
//   )
// }

// export { Progress }

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
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full flex",
        className
      )}
      {...props}
    >
      <div
        className="bg-chart-2 h-full transition-all"
        style={{ width: `${completed}%` }}
      />
      <div
        className="bg-destructive h-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

