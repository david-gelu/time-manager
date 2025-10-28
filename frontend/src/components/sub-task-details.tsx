import { useEffect, useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button"
import { useGetSubTask } from "@/lib/queries"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Badge } from "./ui/badge"
import { Status } from "@/types"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { useQueryClient } from "@tanstack/react-query"

interface SubTaskDetailsProps {
  taskId: string
  trigger?: React.ReactNode
}

export function SubTaskDetails({ taskId, trigger }: SubTaskDetailsProps) {
  console.log(`🚀 ~ taskId:`, taskId)
  const { data } = useGetSubTask(taskId)
  const [open, setOpen] = useState(false)
  console.log(`🚀 ~ open:`, open)

  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['getSubTask', taskId] })
  }, [open])

  const start = data ? new Date(data.start_date) : null
  const end = data ? new Date(data.end_date) : null

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline">View</Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        {data ? (
          <>
            <DrawerHeader>
              <DrawerTitle>Sub task name: <strong className="underline tracking-wider">{data.task_name}</strong></DrawerTitle>
              <Separator className="my-2" />
              <DrawerDescription>
                <div className="flex flex-col gap-2">
                  <span>Description: {data.description}</span>
                  <span>Status: <Badge
                    variant={data.status === Status.COMPLETED ? "secondary" : data.status === Status.IN_PROGRESS ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {data.status}
                  </Badge>
                  </span>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm gap-4">
                    <div>
                      <span>Start: {format(start!, "dd-MM-yyyy HH:mm")}</span>
                    </div>
                    <div>
                      <span>End: {format(end!, "dd-MM-yyyy HH:mm")}</span>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  {data.checklist && data.checklist.map(c => <div className="flex items-center gap-2 text-foreground" key={c.label}>
                    <Checkbox checked={c.checked} key={c.label} className=" cursor-not-allowed" />
                    <Label>{c.label}</Label>
                  </div>)}
                </div>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Închide</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : (
          <div className="p-4 text-center">Se încarcă datele...</div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
