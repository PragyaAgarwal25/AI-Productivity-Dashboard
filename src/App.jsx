import { useState, Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/layout/Sidebar"
import Header  from "./components/layout/Header"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import { TasksProvider } from "./context/TasksContext"
import { NotesProvider } from "./context/NotesContext"

// Lazy-loaded pages (performance optimization)
const Dashboard   = lazy(() => import("./pages/Dashboard"))
const Tasks       = lazy(() => import("./pages/Tasks"))
const Notes       = lazy(() => import("./pages/Notes"))
const Calendar    = lazy(() => import("./pages/Calendar"))
const Weather     = lazy(() => import("./pages/Weather"))
const AIAssistant = lazy(() => import("./pages/AIAssistant"))

function PageLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
      <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Loading…</div>
    </div>
  )
}

function AppShell() {
  const { cssVars } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "var(--bg)",
        color: "var(--text)",
        transition: "background 0.3s, color 0.3s",
        ...cssVars,
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header />
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"         element={<Dashboard />}   />
              <Route path="/tasks"    element={<Tasks />}       />
              <Route path="/notes"    element={<Notes />}       />
              <Route path="/calendar" element={<Calendar />}    />
              <Route path="/weather"  element={<Weather />}     />
              <Route path="/ai"       element={<AIAssistant />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <NotesProvider>
          <AppShell />
        </NotesProvider>
      </TasksProvider>
    </ThemeProvider>
  )
}
