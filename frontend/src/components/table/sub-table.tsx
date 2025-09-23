import { useState, type MouseEvent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { MoveHorizontal, MoreHorizontal, Settings2 } from 'lucide-react'
import { Button } from '../ui/button'
import { format } from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { toast } from 'sonner'
import { deleteSubTask } from '@/lib/dailyTasks'
import { useQueryClient } from '@tanstack/react-query'
import { Status, type Task } from '@/types'
import EditTask from '../edit-tasks'
import { useColumnWidths } from '@/contexts/ColumnWidthContext'
import { Badge } from '../ui/badge'

interface SubTableProps<T extends Record<string, any>> {
  data: Task[]
  parentId: string
}

export default function SubTable<T extends Record<string, any>>({ data, parentId }: SubTableProps<T>) {
  const queryClient = useQueryClient()
  // Nu mai folosim parentId pentru widths - toate subtabelele vor avea aceleași dimensiuni
  const { widths, setWidths } = useColumnWidths()
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

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
        // Convertim direct din pixeli la rem folosind root font-size (16px default)
        const diffRem = diff / 16 // 1rem = 16px

        setWidths(prev => {
          const newWidths = { ...prev }

          const currentWidth = startWidths[columnId] || 12 // Default width 12rem
          const newCurrentWidth = Math.max(2, currentWidth + diffRem)
          newWidths[columnId] = newCurrentWidth

          // Ajustăm următoarea coloană dacă nu e ultima
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
            {data.map((row, rowIndex) => (
              <TableRow key={(row as any)._id || rowIndex} className="border-b hover:bg-muted/30">
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
                      >{renderCellValue(row, col)}</Badge>
                    }
                  </TableCell>
                ))}
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
                      }).catch(err => {
                        console.error(err)
                        toast.error("Failed to delete task")
                      })}>
                        <Tooltip>
                          <TooltipTrigger>Delete sub task</TooltipTrigger>
                          <TooltipContent>
                            <p>This will delete <strong>{row.task_name}</strong> sub task.</p>
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
      {openEditModal && <EditTask open={openEditModal} onOpenChange={setOpenEditModal} subTask={selectedTask as Task} />}
    </div>
  )
}