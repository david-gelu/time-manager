import { createContext, useContext, useState, type ReactNode, useEffect } from 'react'

// Schimbăm structura pentru a avea dimensiuni globale în loc de per parentId
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
        // Dacă avem structura veche (cu parentId), convertim la structura nouă
        if (typeof parsed === 'object' && parsed !== null) {
          // Verificăm dacă e structura veche (cu parentId keys)
          const firstKey = Object.keys(parsed)[0]
          if (firstKey && typeof parsed[firstKey] === 'object' && parsed[firstKey] !== null) {
            // Structura veche - luăm prima configurație disponibilă
            const firstParentWidths = Object.values(parsed)[0] as ColumnWidths
            return firstParentWidths || {}
          }
          // Structura nouă
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