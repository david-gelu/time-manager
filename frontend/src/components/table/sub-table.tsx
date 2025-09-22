import { useEffect, useState, type MouseEvent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { MoveHorizontal, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { format } from 'date-fns'

interface SubTableProps<T extends Record<string, any>> {
  data: T[]
  parentId: string
  onAction?: (row: T) => void
}

export default function SubTable<T extends Record<string, any>>({ data, parentId, onAction }: SubTableProps<T>) {
  const SUB_TABLE_STORAGE_KEY = 'sub-table-column-widths'
  const [childColWidths, setChildColWidths] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const saved = localStorage.getItem(SUB_TABLE_STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try { localStorage.setItem(SUB_TABLE_STORAGE_KEY, JSON.stringify(childColWidths)) } catch { }
  }, [childColWidths])

  const allColumns: (keyof T)[] = data.length > 0 ? Object.keys(data[0]).filter(k => k !== '_id') as (keyof T)[] : []

  const columnOrder: (keyof T)[] = ['task_name', 'description', 'status', 'start_date', 'end_date'] as (keyof T)[]
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

  const renderCellValue = (row: T, col: keyof T) => {
    if ((col === 'start_date' || col === 'end_date') && row[col]) {
      const date = new Date(row[col])
      return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'dd-MM-yyyy HH:mm')
    }
    return row[col]
  }

  return (
    <div className="bg-muted/50 p-4 border-t">
      <div className="overflow-x-auto max-h-auto">
        <Table className="w-full text-sm">
          <TableHeader className='border-b'>
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
                Actions
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
                    style={{ width: `${widths[String(col)] || 20}%`, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {renderCellValue(row, col)}
                  </TableCell>
                ))}
                <TableCell className="px-4 border-r last:border-r-0">
                  <Button size="sm" variant="ghost" onClick={() => onAction?.(row)}>
                    <MoreHorizontal />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
