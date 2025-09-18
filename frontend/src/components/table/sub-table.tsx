import { useEffect, useState, type MouseEvent } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { MoveHorizontal } from 'lucide-react'
interface SubTableProps<T extends Record<string, any>> {
  data: T[]
  parentId: string
}

export default function SubTable<T extends Record<string, any>>({ data, parentId }: SubTableProps<T>) {
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

  const childColumns: (keyof T)[] = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'id') as (keyof T)[] : []

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

          if (index < childColumns.length - 1) {
            const nextColumn = childColumns[index]
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

  return (
    <div className="bg-muted/50 p-4 border-t">
      <div className="overflow-x-auto max-h-auto">
        <Table className="w-full text-sm">
          <TableHeader className='border-b'>
            <TableRow >
              {childColumns.map((col, idx) => (
                <TableHead
                  key={String(col)}
                  className="text-left capitalize px-4 font-medium border-r last:border-r-0 relative"
                  style={{ width: `${widths[String(col)] || 25}%` }}
                >
                  {String(col)}
                  {idx < childColumns.length - 1 && (
                    <MoveHorizontal
                      className="absolute z-10 right-0 top-1 translate-x-1/2 -translate-y-1/2 h-3 w-4 bg-border cursor-col-resize hover:bg-primary transition-colors rounded"
                      onMouseDown={handleChildMouseResize(String(col), idx)}
                    />
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={(row as any)._id || rowIndex} className="border-b hover:bg-muted/30">
                {childColumns.map(col => (
                  <TableCell
                    key={String(col)}
                    className="px-4 border-r last:border-r-0"
                    style={{ width: `${widths[String(col)] || 25}%`, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {row[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}