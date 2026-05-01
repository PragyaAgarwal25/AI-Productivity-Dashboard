import { createContext, useContext, useState } from "react"
import { themes } from "../styles/theme"

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)

  function toggleTheme() {
    setDark((prev) => !prev)
  }

  const cssVars = themes[dark ? "dark" : "light"]

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, cssVars }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
