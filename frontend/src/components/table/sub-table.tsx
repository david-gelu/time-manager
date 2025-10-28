import { useState, type MouseEvent, type ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { MoveHorizontal, Settings2, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { deleteSubTask, updateSubTaskStatus } from '@/lib/dailyTasks'
import { useQueryClient } from '@tanstack/react-query'
import { Status, type Task } from '@/types'
import EditTask from '../edit-tasks'
import { useColumnWidths } from '@/contexts/ColumnWidthContext'
import { Badge } from '../ui/badge'
import useTabAlertForTasks from '@/hooks/useTableAlert'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { SubTaskDetails } from '../sub-task-details'

interface SubTableProps<T extends Record<string, any>> {
  data: Task[]
  parentId: string
}

const statuses = [
  { value: Status.NEW, label: Status.NEW },
  { value: Status.IN_PROGRESS, label: Status.IN_PROGRESS },
  { value: Status.COMPLETED, label: Status.COMPLETED }
]

export default function SubTable<T extends Record<string, any>>({ data }: SubTableProps<T>) {
  const queryClient = useQueryClient()
  const { widths, setWidths } = useColumnWidths()
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const [statusValue, setStatusValue] = useState<Record<string | number, string>>({})

  const allColumns: (keyof Task)[] = data.length > 0 ?
    (Object.keys(data[0]).filter(k => k !== "_id") as (keyof Task)[]) :
    []

  const columnOrder: (keyof Task)[] = ["task_name", "description", "status", "start_date", "end_date"]
  const childColumnsOrdered = columnOrder.filter(c => allColumns.includes(c))

  const handleChildMouseResize = (columnId: string, index: number) => {
    return (e: MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidths = { ...widths }

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const diff = e.clientX - startX
        const diffRem = diff / 16
        setWidths(prev => {
          const newWidths = { ...prev }
          const currentWidth = startWidths[columnId] || 12
          newWidths[columnId] = Math.max(2, currentWidth + diffRem)
          if (index < childColumnsOrdered.length - 1) {
            const nextCol = childColumnsOrdered[index + 1]
            const nextWidth = startWidths[nextCol] || 12
            newWidths[nextCol] = Math.max(2, nextWidth - diffRem)
          }
          return newWidths
        })
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  const getRowColorClass = (row: Task) => {
    if (!row.start_date || !row.end_date) return ''
    const startDate = new Date(row.start_date)
    const endDate = new Date(row.end_date)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return ''
    const totalDuration = endDate.getTime() - startDate.getTime()
    const now = new Date().getTime()
    const timeElapsed = now - startDate.getTime()
    const percentageElapsed = (timeElapsed / totalDuration) * 100
    switch (row.status) {
      case Status.COMPLETED:
        return 'shadow-[inset_4px_0_0_0_var(--primary)]'
      case Status.NEW:
      case Status.IN_PROGRESS:
        if (percentageElapsed >= 90) return 'shadow-[inset_4px_0_0_0_var(--destructive)]'
        if (percentageElapsed >= 75) return 'shadow-[inset_4px_0_0_0_var(--secondary)]'
        return 'shadow-[inset_4px_0_0_0_var(--primary)]'
      default:
        return ''
    }
  }

  const renderCellValue = (row: Task, col: keyof Task): ReactNode => {
    const value = row[col]
    if ((col === 'start_date' || col === 'end_date') && value) {
      const date = new Date(value as string)
      return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'dd-MM-yyyy HH:mm')
    }
    if (Array.isArray(value)) {
      return value.map((item, i) => (
        <span key={i}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</span>
      ))
    }
    if (value === null || value === undefined) return ''
    return String(value)
  }

  useTabAlertForTasks(data)

  return (
    <div className="bg-muted/30 p-2 border-t">
      <div className="overflow-x-auto max-h-auto">
        <Table className="w-full text-sm round">
          <TableHeader className='border-b bg-muted/50'>
            <TableRow>
              {childColumnsOrdered.map((col, idx) => (
                <TableHead
                  key={String(col)}
                  className="text-left capitalize px-4 font-medium border-r last:border-r-0 relative group"
                  style={{ width: `${widths[col] || 12}rem` }}
                >
                  {String(col).replace(/_/g, ' ')}
                  {idx < childColumnsOrdered.length - 1 && (
                    <MoveHorizontal
                      className="absolute z-10 right-0 top-1 translate-x-1/2 -translate-y-1/2 h-3 w-4 bg-border cursor-col-resize hover:bg-primary transition-colors rounded opacity-0 group-hover:opacity-100"
                      onMouseDown={handleChildMouseResize(String(col), idx)}
                    />
                  )}
                </TableHead>
              ))}
              <TableHead className="text-left capitalize px-4 font-medium border-r last:border-r-0">
                <Settings2 />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => {
              const rowKey = (row as any)._id || rowIndex
              return (
                <TableRow key={rowKey} className={`hover:bg-muted/30 ${getRowColorClass(row)}`}>
                  {childColumnsOrdered.map(col => (
                    <TableCell
                      key={String(col)}
                      className="px-4 border-r last:border-r-0"
                      style={{
                        width: `${widths[col] || 12}rem`,
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        overflow: 'hidden'
                      }}
                    >
                      {col !== 'status' ? renderCellValue(row, col) :
                        <Badge
                          variant={row.status === Status.COMPLETED ? 'secondary' : row.status === Status.IN_PROGRESS ? 'default' : 'destructive'}
                          className={`w-full capitalize`}
                        >
                          {renderCellValue(row, col)}
                        </Badge>
                      }
                    </TableCell>
                  ))}

                  <TableCell className="px-4 border-r last:border-r-0 flex flex-col gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Select
                          value={statusValue[rowKey] || row.status}
                          onValueChange={async (val: string) => {
                            setStatusValue(prev => ({ ...prev, [rowKey]: val }))
                            await updateSubTaskStatus((row as any)._id || rowIndex, val as Status)
                            queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] })
                          }}
                        >
                          <Tooltip>
                            <TooltipTrigger className="w-full">
                              <SelectTrigger className="w-full cursor-pointer capitalize">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </TooltipTrigger>
                            <TooltipContent side='left' className='cursor-pointer'>
                              Change status.
                            </TooltipContent>
                          </Tooltip>
                          <SelectContent>
                            <SelectGroup>
                              {statuses.map(status => (
                                <SelectItem key={status.value} value={status.value} className='capitalize'>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Tooltip>
                          <DropdownMenuItem asChild>
                            <SubTaskDetails
                              taskId={row._id as string}
                              trigger={
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" className="w-full justify-start px-2">  View sub task </Button>
                                </TooltipTrigger>
                              }
                            />
                          </DropdownMenuItem>
                          <TooltipContent side="left" className="cursor-pointer">
                            View sub task <strong>{row.task_name}</strong>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <DropdownMenuItem onClick={() => { setSelectedTask(row); setOpenEditModal(true) }}>
                            <TooltipTrigger>Edit sub task</TooltipTrigger>
                          </DropdownMenuItem>
                          <TooltipContent side='left' className='cursor-pointer'>
                            Edit <strong>{row.task_name}</strong> task
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <DropdownMenuItem onClick={() => deleteSubTask((row as any)._id || rowIndex).then(() => {
                            toast.success(`${row.task_name} task deleted successfully`)
                            queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] })
                          }).catch(err => {
                            console.error(err)
                            toast.error("Failed to delete task")
                          })}>
                            <TooltipTrigger>Delete sub task</TooltipTrigger>
                          </DropdownMenuItem>
                          <TooltipContent side='left' className='cursor-pointer'>
                            This will delete <strong>{row.task_name}</strong> sub task.
                          </TooltipContent>
                        </Tooltip>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {openEditModal && <EditTask open={openEditModal} onOpenChange={setOpenEditModal} subTask={selectedTask as Task} />}
    </div>
  )
}
