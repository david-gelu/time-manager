import { useEffect, useState, type MouseEvent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { MoveHorizontal, MoreHorizontal, Settings2 } from 'lucide-react'
import { Button } from '../ui/button'
import { format } from 'date-fns'
import EditTask from '../edit-tasks'
import { Status, type Task } from '@/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { toast } from 'sonner'
import { deleteSubTask } from '@/lib/dailyTasks'
import { useQueryClient } from '@tanstack/react-query'

interface SubTableProps<T extends Record<string, any>> {
  data: Task[]
  parentId: string
  onAction?: (row: T) => void
}

export default function SubTable<T extends Record<string, any>>({ data, parentId, onAction }: SubTableProps<T>) {
  const SUB_TABLE_STORAGE_KEY = 'sub-table-column-widths'
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [childColWidths, setChildColWidths] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const saved = localStorage.getItem(SUB_TABLE_STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const queryClient = useQueryClient()
  useEffect(() => {
    try { localStorage.setItem(SUB_TABLE_STORAGE_KEY, JSON.stringify(childColWidths)) } catch { }
  }, [childColWidths])

  const allColumns: (keyof Task)[] = data.length > 0 ?
    (Object.keys(data[0]).filter(k => k !== "_id") as (keyof Task)[]) :
    []

  const columnOrder: (keyof Task)[] = ["task_name", "description", "status", "start_date", "end_date"]

  const childColumnsOrdered = columnOrder.filter(c => allColumns.includes(c))

  const handleChildMouseResize = (columnId: string, index: number) => {
    return (e: MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidths = { ...(childColWidths[parentId] || {}) }

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const diff = e.clientX - startX
        const containerWidth = 800
        const diffPercent = (diff / containerWidth) * 100

        setChildColWidths(prev => {
          const prevWidths = prev[parentId] || {}
          const newWidths = { ...prevWidths }
          const currentWidth = startWidths[columnId] || 25
          const newCurrentWidth = Math.max(5, currentWidth + diffPercent)

          if (index < childColumnsOrdered.length - 1) {
            const nextColumn = childColumnsOrdered[index + 1]
            const nextWidth = startWidths[nextColumn as string] || 25
            newWidths[columnId] = newCurrentWidth
            newWidths[nextColumn as string] = Math.max(5, nextWidth - diffPercent)
          } else {
            newWidths[columnId] = newCurrentWidth
          }
          return { ...prev, [parentId]: newWidths }
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

  const widths = childColWidths[parentId] || {}

  const renderCellValue = (row: Task, col: keyof Task) => {
    if ((col === 'start_date' || col === 'end_date') && row[col]) {
      const date = new Date(row[col])
      return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'dd-MM-yyyy HH:mm')
    }
    return row[col]
  }

  return (
    <div className="bg-muted/30 p-2 border-t">
      <div className="overflow-x-auto max-h-auto">
        <Table className="w-full text-sm round">
          <TableHeader className='border-b bg-muted/50 '>
            <TableRow>
              {childColumnsOrdered.map((col, idx) => (
                <TableHead
                  key={String(col)}
                  className="text-left capitalize px-4 font-medium border-r last:border-r-0 relative group"
                  style={{ width: `${widths[String(col)] || 20}%` }}
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
            {data.map((row, rowIndex) => (
              <TableRow key={(row as any)._id || rowIndex} className="border-b hover:bg-muted/30">
                {childColumnsOrdered.map(col => {
                  return (<TableCell key={String(col)} className="px-4 border-r last:border-r-0" style={{ width: `${widths[String(col)] || 20}%`, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {col !== 'status' ? renderCellValue(row, col) :
                      <Label className={`px-2 py-1 rounded-full text-xs font-medium justify-center ${row.status === Status.COMPLETED ? 'bg-green-100 text-green-800' :
                        row.status === Status.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{renderCellValue(row, col)}</Label>
                    } </TableCell>);
                })}
                <TableCell className="px-4 border-r last:border-r-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => { setSelectedTask(row); setOpenEditModal(true) }}>
                        <Tooltip>
                          <TooltipTrigger>Edit sub task</TooltipTrigger>
                          <TooltipContent>
                            <p>Edit <strong>{row.task_name}</strong> task</p>
                          </TooltipContent>
                        </Tooltip>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteSubTask((row as any)._id || rowIndex).then(() => {
                        toast.success(`${row.task_name} task deleted successfully`)
                        queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] })
                      }).catch((err) => {
                        console.error(`🚀 ~ err:`, err)
                        toast.error("Failed to delete task")
                      })}>
                        <Tooltip>
                          <TooltipTrigger>Delete sub task</TooltipTrigger>
                          <TooltipContent>
                            <p> This will delete <strong>{row.task_name}</strong> sub task.</p>
                          </TooltipContent>
                        </Tooltip>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {openEditModal && <EditTask
        open={openEditModal}
        onOpenChange={setOpenEditModal}
        subTask={selectedTask as Task}
      />}
    </div>
  )
}
