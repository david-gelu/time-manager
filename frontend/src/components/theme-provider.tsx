import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const getSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    const currentTheme = theme === "system" ? getSystemTheme() : theme
    root.classList.add(currentTheme)

    const id = "primereact-theme"
    const existingLink = document.getElementById(id) as HTMLLinkElement | null

    const themeHref =
      currentTheme === "dark"
        ? "https://unpkg.com/primereact/resources/themes/lara-dark-indigo/theme.css"
        : "https://unpkg.com/primereact/resources/themes/lara-light-indigo/theme.css"

    if (existingLink) {
      existingLink.href = themeHref
    } else {
      const link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      link.href = themeHref
      document.head.appendChild(link)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
