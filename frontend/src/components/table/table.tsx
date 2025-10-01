import { Fragment, useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import {

  MoreHorizontal,
  Columns,
  MoveHorizontal,
  TableCellsMerge,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronRight,
  ChevronUp
} from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import SubTable from './sub-table'
import { Status, type DailyTasks, type Task } from '@/types'
import { Progress } from '../ui/progress'
import { useAllDailyTasks } from '@/lib/queries'
import { format } from 'date-fns'
import AddSubTask from '../add-sub-task'
import EditTask from '../edit-tasks'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { deleteDailyTask, duplicateDailyTask } from '@/lib/dailyTasks'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Badge } from '../ui/badge'

export default function TableComponent() {
  const { data = [], isLoading } = useAllDailyTasks()
  const [sorting, setSorting] = useState([{ id: 'date', desc: true }])
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [openModal, setOpenModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<DailyTasks | null>(null)
  const STORAGE_KEY = 'table-column-widths'
  const queryClient = useQueryClient()

  const loadSavedWidths = (): Record<string, number> => {
    try {
      const savedWidths = localStorage.getItem(STORAGE_KEY)
      return savedWidths ? JSON.parse(savedWidths) : {}
    } catch (error) {
      console.warn('Failed to load column widths from localStorage:', error)
      return {}
    }
  }
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => loadSavedWidths())

  useEffect(() => {
    if (Object.keys(colWidths).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(colWidths))
      } catch (error) {
        console.warn('Failed to save column widths to localStorage:', error)
      }
    }
  }, [colWidths])
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) newSet.delete(rowId)
      else newSet.add(rowId)
      return newSet
    })
  }

  const generateColumns = (): ColumnDef<DailyTasks>[] => {
    if (isLoading && !data || !data.length) return [];

    const expanderCol: ColumnDef<DailyTasks> = {
      id: "expander",
      header: () => <div className="w-fit"></div>,
      cell: ({ row }) => {
        const task = row.original;
        if (!task.tasks?.length) return <div className="w-fit"></div>;
        return (
          <Button variant="ghost" className="h-6 w-fit p-0" onClick={() => toggleRowExpansion(task._id)}>
            {expandedRows.has(task._id) ? <ChevronDown className="h-4 w-fit" /> : <ChevronRight className="h-4 w-fit" />}
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    };

    const columns: ColumnDef<DailyTasks>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: ({ row }) => {
          const status = row.original.status;
          return <Badge
            variant={status === Status.COMPLETED ? 'secondary' : status === Status.IN_PROGRESS ? 'default' : 'destructive'}
            className={`w-full capitalize`}
          > {status}</Badge>
        }
      },
      {
        accessorKey: 'date',
        header: 'Date',
        enableSorting: true,
        accessorFn: (row) => new Date(row.date).getTime(),
        cell: ({ row }) => {
          const value = row.original.date;
          const date = new Date(value);
          return !isNaN(date.getTime()) ? <div>{format(date, 'dd-MM-yyyy HH:mm')}</div> : <div>Invalid date</div>;
        },
      },
      {
        id: 'progress',
        header: 'Progress',
        enableSorting: false,
        cell: ({ row }: any) => {
          const tasks = row.original.tasks;
          const total = tasks.length;
          const done = tasks.filter((t: Task) => t.status === Status.COMPLETED).length;
          const inProgress = tasks.filter((t: Task) => t.status === Status.IN_PROGRESS).length;
          const tasksDone = total ? (done / total) * 100 : 0;
          const tasksProgress = total ? (inProgress / total) * 100 : 0;
          return (
            <div className="flex flex-col gap-1">
              <Progress value={tasksDone} inProgress={tasksProgress} />
              <span className="text-xs text-muted-foreground">{done} task are done and {inProgress} in progress from {total}</span>
            </div>
          );
        }
      },
      {
        id: "actions",
        header: () => <div className="w-fit"></div>,
        enableHiding: false,
        cell: ({ row }: any) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Tooltip>
                <DropdownMenuItem onClick={() => { setSelectedTask(row.original); setOpenModal(true) }}>
                  <TooltipTrigger> Add sub task</TooltipTrigger>
                </DropdownMenuItem>
                <TooltipContent className='cursor-pointer'>
                  Add new sub task for <strong>{row.original.name}.</strong>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <DropdownMenuItem onClick={() => { setSelectedTask(row.original); setOpenEditModal(true) }} >
                    Edit daily task
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent className='cursor-pointer'>
                  Edit <strong>{row.original.name}</strong> task.
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <DropdownMenuItem onClick={() => duplicateDailyTask(row.original).then(() => {
                  toast.success(`${row.original.name} task was duplicated successfully`)
                  queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] })
                }).catch((err) => {
                  console.error(`🚀 ~ err:`, err)
                  toast.error("Failed to duplicate task")
                })}>
                  <TooltipTrigger>Duplicate daily task</TooltipTrigger>
                </DropdownMenuItem>
                <TooltipContent className='cursor-pointer'>
                  This will duplicate the entire <strong>{row.original.name}</strong> task with sub tasks too.
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <DropdownMenuItem onClick={() => deleteDailyTask(row.original._id).then(() => {
                  toast.success(`${row.original.name} task deleted successfully`)
                  queryClient.invalidateQueries({ queryKey: ['allDailyTasks'] })
                }).catch((err) => {
                  console.error(`🚀 ~ err:`, err)
                  toast.error("Failed to delete task")
                })}>
                  <TooltipTrigger>Delete daily task</TooltipTrigger>
                </DropdownMenuItem>
                <TooltipContent className='cursor-pointer'>
                  This will delete the entire <strong>{row.original.name}</strong> task with sub tasks too.
                </TooltipContent>
              </Tooltip>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ];

    return data.some(d => d.tasks.length > 0) ? [expanderCol, ...columns] : columns;
  };


  const columns = useMemo(() => generateColumns(), [data, expandedRows])

  const table = useReactTable({
    data: data || [],
    columns,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = String(filterValue).toLowerCase().trim()
      if (!searchValue) return true
      const searchableValues = Object.values(row.original).map(v => String(v).toLowerCase()).join(' ')
      return searchableValues.includes(searchValue)
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  const visibleColumns = table.getVisibleLeafColumns()
  useEffect(() => {
    if (visibleColumns.length > 0) {
      setColWidths(prev => {
        const newWidths = { ...prev }
        let hasNewColumns = false

        const columnsNeedingWidths = visibleColumns.filter(col => !newWidths[col.id])

        if (columnsNeedingWidths.length > 0) {
          hasNewColumns = true
          const usedWidth = visibleColumns
            .filter(col => newWidths[col.id])
            .reduce((sum, col) => sum + (newWidths[col.id] || 0), 0)

          const availableWidth = Math.max(100 - usedWidth, columnsNeedingWidths.length * 10)
          const widthPerNewColumn = availableWidth / columnsNeedingWidths.length

          columnsNeedingWidths.forEach(col => {
            newWidths[col.id] = Math.max(10, widthPerNewColumn)
          })
        }

        return hasNewColumns ? newWidths : prev
      })
    }
  }, [visibleColumns.map(col => col.id).join(',')])

  const handleMouseResize = (columnId: string, index: number) => {
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidths = { ...colWidths }

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const diff = e.clientX - startX

        setColWidths(prev => {
          const newWidths = { ...prev }
          const currentWidth = startWidths[columnId] || 9
          const newCurrentWidth = Math.max(50, currentWidth + diff)

          if (index < visibleColumns.length - 1) {
            const nextColumn = visibleColumns[index + 1]
            const nextWidth = startWidths[nextColumn.id] || 9
            const newNextWidth = Math.max(50, nextWidth - diff)
            newWidths[columnId] = newCurrentWidth
            newWidths[nextColumn.id] = newNextWidth
          } else {
            newWidths[columnId] = newCurrentWidth
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
    return handleMouseDown
  }


  return (
    <div className="px-4 w-full mx-auto">
      <div className="flex items-center justify-end py-1 gap-2">
        <Input
          type="text"
          placeholder="Search..."
          value={globalFilter ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
          className="max-w-[200px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><Columns className="mr-2 h-4 w-4" />Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Vizibilitate coloane</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table.getAllColumns().filter(c => c.getCanHide()).map(c => (
              <DropdownMenuCheckboxItem
                key={c.id}
                checked={c.getIsVisible()}
                onCheckedChange={v => c.toggleVisibility(!!v)}
              >
                {c.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table className="w-full border-collapse text-sm h-full">
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="capitalize border-b">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className="relative border-r last:border-r-0 text-left align-top py-2 group cursor-pointer select-none"
                    style={{ width: `${colWidths[header.id] || 9}rem` }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="mx-3 flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}

                      <span className="ml-1 transition-opacity duration-200">
                        {{
                          asc: <ChevronUp className="h-3 w-3" />,
                          desc: <ChevronDown className="h-3 w-3" />
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>

                    {index < headerGroup.headers.length - 1 && (
                      <MoveHorizontal
                        className="absolute z-10 right-0 top-1/3 translate-x-1/2 -translate-y-1/2 h-4 w-5 bg-border cursor-col-resize hover:bg-primary transition-colors rounded opacity-0 group-hover:opacity-100"
                        onMouseDown={handleMouseResize(header.id, index)}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const task = row.original
                const isExpanded = expandedRows.has(task._id)

                return (
                  <Fragment key={row.id}>
                    {/* Tabel principal row */}
                    <TableRow className="border-b hover:bg-muted/30">
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          className="py-0 border-r last:border-r-0"
                          key={cell.id}
                          style={{ width: `${colWidths[cell.column.id] || 9}rem` }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Subtable cu motion */}
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length} className="p-0">
                        <AnimatePresence initial={false}>
                          {isExpanded && task.tasks?.length > 0 && (
                            <motion.div
                              key="subtable"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ overflow: "hidden" }}
                            >
                              <SubTable data={task.tasks} parentId={task._id} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                )
              })
            ) : (
              <TableRow className="w-full flex flex-col items-center h-[60vh]">
                <TableCell
                  colSpan={visibleColumns.length}
                  className="p-8 text-center w-full flex flex-col items-center gap-2 text-xl absolute left-[0%] top-[25%] -translate-50%"
                >
                  <TableCellsMerge className="h-20 w-full" />
                  Nu s-au găsit rezultate.
                </TableCell>
              </TableRow>
            )}
          </TableBody>


        </Table>

        <div className="flex items-center mt-auto justify-between p-4 bg-muted/50 border-t">
          <Button
            className="px-4 py-2 text-sm border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Pagina{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} din {table.getPageCount()}
            </strong>{' '}
            | {table.getFilteredRowModel().rows.length} rezultate totale
          </span>
          <Button
            className="px-4 py-2 text-sm border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Următorul <ChevronsRight />
          </Button>
        </div>
      </div>
      {openModal && <AddSubTask
        open={openModal}
        onOpenChange={setOpenModal}
        task={selectedTask as DailyTasks}
      />}
      {openEditModal && <EditTask
        open={openEditModal}
        onOpenChange={setOpenEditModal}
        dailyTask={selectedTask as DailyTasks}
      />}
    </div>
  )
}