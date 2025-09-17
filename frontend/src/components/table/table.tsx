import { Fragment, useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type HeaderContext,
  type CellContext
} from "@tanstack/react-table"
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  MoreHorizontal,
  Columns,
  MoveHorizontal,
  TableCellsMerge,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import SubTable from './sub-table'
import { Status, type DailyTasks, type Task } from '@/types'

// ----- DEFAULT DATA -----
const defaultData: DailyTasks[] = [
  {
    id: '1',
    name: "Plan zilnic Maria",
    date: "2025-09-16",
    status: Status.NEW,
    description: "Sarcini zilnice",
    tasks: [
      {
        id: 't1',
        task_name: "Scrie raport",
        status: Status.IN_PROGRESS,
        start_date: "2025-09-16",
        end_date: "2025-09-16",
        description: "Raport pentru șef",
      },
      {
        id: 't2',
        task_name: "Ședință",
        status: Status.COMPLETED,
        start_date: "2025-09-16",
        end_date: "2025-09-16",
        description: "Discutat proiect",
      },
    ],
  },
  {
    id: '2',
    name: "Plan zilnic Andrei",
    date: "2025-09-16",
    status: Status.IN_PROGRESS,
    description: "Lucru pe proiect",
    tasks: [],
  },
]
export default function TableComponent() {
  const [data] = useState<DailyTasks[]>(() => [...defaultData])
  const [sorting, setSorting] = useState<any[]>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const STORAGE_KEY = 'table-column-widths'

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
    if (!data.length) return []

    const keys = Object.keys(data[0]).filter(k => k !== "id" && k !== "tasks")

    const expanderCol: ColumnDef<DailyTasks> = {
      id: "expander",
      header: () => <div className="w-fit"></div>,
      cell: ({ row }) => {
        const task = row.original
        if (!task.tasks?.length) return <div className="w-fit"></div>
        return (
          <Button variant="ghost" className="h-6 w-fit p-0" onClick={() => toggleRowExpansion(task.id)}>
            {expandedRows.has(task.id) ? <ChevronDown className="h-4 w-fit" /> : <ChevronRight className="h-4 w-fit" />}
          </Button>
        )
      },
      enableSorting: false,
      enableHiding: false,
    }

    const dynamicCols = keys.map(key => ({
      accessorKey: key,
      id: key,
      header: key,
      cell: ({ row }: any) => <div>{row.getValue(key)}</div>,
      enableSorting: true,
      enableHiding: true,
    }))

    const actionCol: ColumnDef<DailyTasks> = {
      id: "actions",
      enableHiding: false,
      header: () => <div className="w-fit"></div>,
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0"><MoreHorizontal /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(String(row.original.id))}>Copiază ID</DropdownMenuItem>
            <DropdownMenuItem>Vezi detalii</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return [expanderCol, ...dynamicCols, actionCol]
  }

  const columns = useMemo(() => generateColumns(), [data, expandedRows])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
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
  }, [visibleColumns.map(col => col.id).join(','), expandedRows])

  const handleMouseResize = (columnId: string, index: number) => {
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidths = { ...colWidths }

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const diff = e.clientX - startX
        const containerWidth = 800
        const diffPercent = (diff / containerWidth) * 100

        setColWidths(prev => {
          const newWidths = { ...prev }
          const currentWidth = startWidths[columnId] || 25
          const newCurrentWidth = Math.max(5, currentWidth + diffPercent)

          if (index < visibleColumns.length - 1) {
            const nextColumn = visibleColumns[index + 1]
            const nextWidth = startWidths[nextColumn.id] || 25
            const newNextWidth = Math.max(5, nextWidth - diffPercent)
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
          placeholder="Căutare..."
          value={globalFilter ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
          className="max-w-[200px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><Columns className="mr-2 h-4 w-4" />Coloane</Button>
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
        <Table className="w-full border-collapse text-sm">
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="capitalize border-b">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className="relative border-r last:border-r-0 text-left align-top py-2"
                    style={{ width: `${colWidths[header.id] || 25}%` }}
                  >
                    <div className="mx-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </div>
                    {index < headerGroup.headers.length - 1 && (
                      <MoveHorizontal
                        className="absolute z-10 right-0 top-1/3 translate-x-1/2 -translate-y-1/2 h-4 w-5 bg-border cursor-col-resize hover:bg-primary transition-colors rounded"
                        onMouseDown={handleMouseResize(header.id, index)}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map(row => {
              const task = row.original
              const isExpanded = expandedRows.has(task.id)
              return (
                <Fragment key={row.id}>
                  <TableRow className="border-b hover:bg-muted/30">
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                  {isExpanded && task.tasks?.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length} className="p-0">
                        <SubTable data={task.tasks} parentId={task.id} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}