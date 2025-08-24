import { useEffect, useState, type MouseEvent } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../ui/table'
import { MoveHorizontal } from 'lucide-react'
import { type ColumnDef } from "@tanstack/react-table"

type Person = {
  id: number
  [key: string]: any
}

interface SubTableProps {
  data: Person[]
  columns: ColumnDef<Person>[]
  parentId: number
}

export default function SubTable({ data, columns, parentId }: SubTableProps) {
  const SUB_TABLE_STORAGE_KEY = 'sub-table-column-widths'

  const loadSavedChildWidths = (): Record<number, Record<string, number>> => {
    try {
      const saved = localStorage.getItem(SUB_TABLE_STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      console.warn('Failed to load sub-table column widths from localStorage:', error)
      return {}
    }
  }
  const [childColWidths, setChildColWidths] = useState<Record<number, Record<string, number>>>(() => loadSavedChildWidths())

  useEffect(() => {
    try {
      localStorage.setItem(SUB_TABLE_STORAGE_KEY, JSON.stringify(childColWidths))
    } catch (error) {
      console.warn('Failed to save sub-table column widths to localStorage:', error)
    }
  }, [childColWidths])

  const handleChildMouseResize = (columnId: string, index: number, visibleCols: ColumnDef<Person>[]) => {
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

          if (index < visibleCols.length - 1) {
            const nextColumn = visibleCols[index + 1]
            const nextWidth = startWidths[nextColumn.id as string] || 25
            const newNextWidth = Math.max(5, nextWidth - diffPercent)
            newWidths[columnId] = newCurrentWidth
            newWidths[nextColumn.id as string] = newNextWidth
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

  const childVisibleColumns = columns
  const widths = childColWidths[parentId] || {}

  return (
    <div className="bg-muted/50 p-4 border-t">
      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="border-b w-fit px-4">
              {childVisibleColumns.map((column: ColumnDef<Person>, index: number) => (
                <TableHead
                  key={column.id}
                  className="text-left capitalize px-4 font-medium border-r last:border-r-0 relative"
                  style={{ width: `${widths[column.id as string] || 25}%` }}
                >
                  {column.id === 'expander' || column.id === 'actions' ? '' : (
                    typeof column.header === 'function'
                      ? column.id
                      : column.header
                  )}
                  {index < childVisibleColumns.length - 1 && (
                    <MoveHorizontal
                      className="absolute z-9 right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-5 w-8 bg-border cursor-col-resize hover:bg-primary transition-colors rounded"
                      onMouseDown={handleChildMouseResize(
                        column.id as string,
                        index,
                        childVisibleColumns as ColumnDef<Person>[]
                      )}
                    />
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((child: Person, index: number) => (
              <TableRow
                key={child.id || index}
                className="border-b hover:bg-muted/30 transition-colors w-fit"
              >
                {childVisibleColumns.map((column: ColumnDef<Person>) => {
                  if (column.id === 'expander') {
                    return (
                      <TableCell
                        key={column.id}
                        className="px-4 border-r last:border-r-0"
                        style={{
                          width: `${widths[column.id as string] || 25}%`
                        }}
                      />
                    )
                  }

                  let cellContent: React.ReactNode = ''
                  const accessorKey = (column as any).accessorKey

                  if (typeof column.cell === 'function') {
                    try {
                      cellContent = column.cell({
                        row: {
                          original: child,
                          getValue: (key: string) => child[key as keyof Person]
                        }
                      } as any)
                    } catch {
                      cellContent = accessorKey
                        ? String(child[accessorKey as keyof Person] || '')
                        : ''
                    }
                  } else if (accessorKey && accessorKey in child) {
                    const value = child[accessorKey as keyof Person]
                    cellContent = value ? String(value) : ''
                  }

                  return (
                    <TableCell
                      key={column.id}
                      className="px-4 border-r last:border-r-0"
                      style={{
                        width: `${widths[column.id as string] || 25}%`,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cellContent}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}