import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, MoreHorizontal, MoveHorizontal, Columns } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

type Person = {
  id: number
  firstName: string
  lastName: string
  age: number
  email: string
}

const defaultData: Person[] = [
  { id: 2, firstName: 'Maria', lastName: 'Popescu', age: 29, email: 'maria@example.com' },
  { id: 3, firstName: 'Andrei', lastName: 'Ionescu', age: 42, email: 'andrei@example.com' },
  { id: 4, firstName: 'Vasile', lastName: 'Georgescu', age: 25, email: 'elena@example.com' },
  { id: 5, firstName: 'Ion', lastName: 'Marin', age: 38, email: 'ion@example.com' },
  { id: 6, firstName: 'Ana', lastName: 'Radu', age: 31, email: 'ana@example.com' },
]

export default function ResizableShadcnTable() {
  const [data] = React.useState<Person[]>(() => [...defaultData])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  // Storage key for column widths
  const STORAGE_KEY = 'table-column-widths'

  // Load saved widths from localStorage
  const loadSavedWidths = (): Record<string, number> => {
    try {
      const savedWidths = localStorage.getItem(STORAGE_KEY)
      return savedWidths ? JSON.parse(savedWidths) : {}
    } catch (error) {
      console.warn('Failed to load column widths from localStorage:', error)
      return {}
    }
  }

  // Column widths state for resizing - initialize with saved values
  const [colWidths, setColWidths] = React.useState<Record<string, number>>(() => loadSavedWidths())

  // Save column widths to localStorage whenever they change
  React.useEffect(() => {
    if (Object.keys(colWidths).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(colWidths))
      } catch (error) {
        console.warn('Failed to save column widths to localStorage:', error)
      }
    }
  }, [colWidths])

  // Define columns using TanStack Table format
  const columns = React.useMemo<ColumnDef<Person>[]>(() => [
    {
      accessorKey: "firstName",
      id: "firstName",
      header: ({ column }) => (
        <div className="flex flex-col gap-2">
          <div
            className="font-medium cursor-pointer select-none hover:bg-muted transition-colors flex items-center justify-between"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Prenume</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
          <Input
            type="text"
            placeholder="Filtrează..."
            className="w-full max-w-[120px] text-xs"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "lastName",
      id: "lastName",
      header: ({ column }) => (
        <div className="flex flex-col gap-2">
          <div
            className="font-medium cursor-pointer select-none hover:bg-muted transition-colors flex items-center justify-between"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Nume</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
          <Input
            type="text"
            placeholder="Filtrează..."
            className="w-full max-w-[120px] text-xs"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "age",
      id: "age",
      header: ({ column }) => (
        <div className="flex flex-col gap-2">
          <div
            className="font-medium cursor-pointer select-none hover:bg-muted transition-colors flex items-center justify-between"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Vârstă</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
          <Input
            type="text"
            placeholder="Filtrează..."
            className="w-full max-w-[120px] text-xs"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("age")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "email",
      id: "email",
      header: ({ column }) => (
        <div className="flex flex-col gap-2">
          <div
            className="font-medium cursor-pointer select-none hover:bg-muted transition-colors flex items-center justify-between"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Email</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4 opacity-50" />
            )}
          </div>
          <Input
            type="text"
            placeholder="Filtrează..."
            className="w-full max-w-[120px] text-xs"
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div>Acțiuni</div>,
      cell: ({ row }) => {
        const person = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(String(person.id))}
              >
                Copiază ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Vezi client</DropdownMenuItem>
              <DropdownMenuItem>Detalii plată</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  // Initialize TanStack Table
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 3,
      },
    },
  })

  // Get visible columns for width calculations
  const visibleColumns = table.getVisibleLeafColumns()

  // Initialize column widths only for new columns that don't have saved widths
  React.useEffect(() => {
    if (visibleColumns.length > 0) {
      setColWidths(prev => {
        const newWidths = { ...prev }
        let hasNewColumns = false

        // Check which columns need default widths
        const columnsNeedingWidths = visibleColumns.filter(col => !newWidths[col.id])

        if (columnsNeedingWidths.length > 0) {
          hasNewColumns = true
          // Calculate available width for new columns
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

  // Column resizing logic
  const handleMouseResize = (columnId: string, index: number) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidths = { ...colWidths }

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX
        const containerWidth = e.target
          ? (e.target as HTMLElement).closest('table')?.offsetWidth || 800
          : 800
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
    <div className="p-4 w-full mx-auto">
      {/* Column visibility controls */}
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Columns className="mr-2 h-4 w-4" />
              Coloane
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Vizibilitate coloane</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnDef = column.columnDef as ColumnDef<Person>
                const header = typeof columnDef.header === 'function'
                  ? column.id
                  : columnDef.header || column.id

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === 'firstName' ? 'Prenume' :
                      column.id === 'lastName' ? 'Nume' :
                        column.id === 'age' ? 'Vârstă' :
                          column.id === 'email' ? 'Email' : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50 border-b">
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className="relative border-r last:border-r-0 text-left align-top"
                      style={{
                        width: `${colWidths[header.id] || 25}%`,
                        minWidth: '100px'
                      }}
                    >
                      <div className="mx-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </div>
                      {/* Column resizer - only for non-action columns and not last column */}
                      {header.id !== 'actions' && index < headerGroup.headers.length - 1 && (
                        <MoveHorizontal
                          tabIndex={1}
                          className="absolute z-10 right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-5 w-[1.8rem] bg-border cursor-col-resize hover:bg-primary transition-colors rounded"
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="p-3 mx-3 border-r last:border-r-0 overflow-hidden"
                        style={{
                          width: `${colWidths[cell.column.id] || 25}%`,
                          minWidth: '100px',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Nu s-au găsit rezultate.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 bg-muted/50 border-t">
          <Button
            className="px-4 py-2 text-sm border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            &lt; Anterior
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
            Următorul &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}