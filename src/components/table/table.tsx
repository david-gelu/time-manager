import { useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from 'react'
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
  type VisibilityState,
  type HeaderContext,
  type CellContext
} from "@tanstack/react-table"
import { ArrowDownWideNarrow, ArrowUpNarrowWide, MoreHorizontal, Columns, MoveHorizontal, TableCellsMerge, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'


type Person = {
  id: number
  firstName: string
  lastName: string
  age: number
  email: string,
  test?: string
}

// PROBLEMĂ IDENTIFICATĂ: Datele duplicate cu același ID
// Soluția: Fiecare înregistrare trebuie să aibă un ID unic
const defaultData: Person[] = [
  { id: 1, firstName: 'Maria', lastName: 'Popescu', age: 29, email: 'maria@example.com', test: 'test' },
  { id: 2, firstName: 'Andrei', lastName: 'Ionescu', age: 42, email: 'andrei@example.com' },
  { id: 3, firstName: 'Vasile', lastName: 'Georgescu', age: 25, email: 'vasile@example.com' }, // Fixed email
  { id: 4, firstName: 'Ion', lastName: 'Marin', age: 38, email: 'ion@example.com' },
  { id: 5, firstName: 'Ana', lastName: 'Radu', age: 31, email: 'ana@example.com' },
  { id: 6, firstName: 'Elena', lastName: 'Dumitru', age: 33, email: 'elena@example.com' },
  { id: 7, firstName: 'Mihai', lastName: 'Stoica', age: 45, email: 'mihai@example.com' },
  { id: 8, firstName: 'Alexandra', lastName: 'Popa', age: 27, email: 'alexandra@example.com' },
  { id: 9, firstName: 'Cristian', lastName: 'Nistor', age: 36, email: 'cristian@example.com' },
  { id: 10, firstName: 'Diana', lastName: 'Coman', age: 32, email: 'diana@example.com' },
  { id: 11, firstName: 'Gabriel', lastName: 'Vlad', age: 40, email: 'gabriel@example.com' },
  { id: 12, firstName: 'Ioana', lastName: 'Preda', age: 28, email: 'ioana@example.com' },
  { id: 13, firstName: 'Radu', lastName: 'Mocanu', age: 35, email: 'radu@example.com' },
  { id: 14, firstName: 'Simona', lastName: 'Fieraru', age: 30, email: 'simona@example.com' },
  { id: 15, firstName: 'Bogdan', lastName: 'Tudose', age: 41, email: 'bogdan@example.com' },
]

export default function TableComponent() {
  const [data] = useState<Person[]>(() => [...defaultData])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<string>('')

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
  const generateColumns = (sampleData: Person[]): ColumnDef<Person>[] => {
    if (!sampleData.length) return []

    const keys = Object.keys(sampleData[0]).filter(k => k !== "id")

    const dynamicCols = keys.map((key) => ({
      accessorKey: key,
      id: key,
      header: ({ column }: HeaderContext<Person, unknown>) => (
        <div className="flex flex-col gap-2">
          <div
            className="font-medium cursor-pointer select-none hover:bg-muted transition-colors flex items-center justify-between p-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>{key}</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUpNarrowWide />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDownWideNarrow />
            ) : (
              <span style={{ opacity: 0.5 }}>↓</span>
            )}
          </div>
        </div>
      ),
      cell: ({ row }: CellContext<Person, unknown>) => <div>{row.getValue(key)}</div>,
      enableSorting: true,
      enableHiding: true,
    }))

    const actionCol: ColumnDef<Person> = {
      id: "actions",
      enableHiding: false,
      header: () => <div className="w-auto">Acțiuni</div>,
      cell: ({ row }) => {
        const person = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(String(person.id))}>
                Copiază ID
              </DropdownMenuItem>
              <DropdownMenuItem>Vezi client</DropdownMenuItem>
              <DropdownMenuItem>Detalii plată</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }

    return [...dynamicCols, actionCol]
  }

  const columns = useMemo<ColumnDef<Person>[]>(() => generateColumns(data), [data])

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = String(filterValue).toLowerCase().trim()
      if (!searchValue) return true

      // Search through all values in the row
      const searchableValues = Object.values(row.original).map(value =>
        String(value || '').toLowerCase()
      ).join(' ')

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
            <Button variant="outline" className="">
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

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table className="w-full border-collapse text-sm">
          <TableHeader className="sticky top-0 z-100 bg-sidebar">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="capitalize bg-sidebar border-b">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className="relative border-r last:border-r-0 text-left align-top py-2"
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
                    {header.id !== 'actions' && index < headerGroup.headers.length - 1 && (
                      <MoveHorizontal
                        className="absolute z-10 right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-5 w-8 bg-border cursor-col-resize hover:bg-primary transition-colors rounded"
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
                  className="border-b bg-background hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-3 border-r last:border-r-0 overflow-hidden"
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
              <TableRow className='h-[60dvh]'>
                <TableCell colSpan={visibleColumns.length} className="p-8 text-center flex flex-col items-center gap-2 text-xl">
                  <TableCellsMerge className="h-20 w-20" />
                  Nu s-au găsit rezultate.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 bg-muted/50 border-t">
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
    </div>
  )
}