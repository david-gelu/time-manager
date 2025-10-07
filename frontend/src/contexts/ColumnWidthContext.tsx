import { createContext, useContext, useState, type ReactNode, useEffect } from 'react'

export type ColumnWidths = {
  [columnId: string]: number
}

interface ColumnWidthContextProps {
  widths: ColumnWidths
  setWidths: (value: ColumnWidths | ((prev: ColumnWidths) => ColumnWidths)) => void
}

const ColumnWidthContext = createContext<ColumnWidthContextProps | undefined>(undefined)

export const ColumnWidthProvider = ({ children }: { children: ReactNode }) => {
  const STORAGE_KEY = 'sub-table-column-widths'

  const [widths, setWidths] = useState<ColumnWidths>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed === 'object' && parsed !== null) {
          const firstKey = Object.keys(parsed)[0]
          if (firstKey && typeof parsed[firstKey] === 'object' && parsed[firstKey] !== null) {
            const firstParentWidths = Object.values(parsed)[0] as ColumnWidths
            return firstParentWidths || {}
          }
          return parsed
        }
      }
      return {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widths))
    } catch { }
  }, [widths])

  return (
    <ColumnWidthContext.Provider value={{ widths, setWidths }}>
      {children}
    </ColumnWidthContext.Provider>
  )
}

export const useColumnWidths = () => {
  const ctx = useContext(ColumnWidthContext)
  if (!ctx) throw new Error('useColumnWidths must be used within a ColumnWidthProvider')
  return ctx
}