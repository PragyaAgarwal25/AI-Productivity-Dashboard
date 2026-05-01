import { useState } from "react"
import { useLocation } from "react-router-dom"
import Icon from "../ui/Icon"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import { useTheme } from "../../context/ThemeContext"
import { useTasks } from "../../context/TasksContext"
import { card } from "../../styles/shared"

const PAGE_TITLES = {
  "/":         "Dashboard",
  "/tasks":    "Tasks",
  "/notes":    "Notes",
  "/calendar": "Calendar",
  "/weather":  "Weather",
  "/ai":       "AI Assistant",
}

export default function Header() {
  const { dark, toggleTheme } = useTheme()
  const { tasks } = useTasks()
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)

  const title = PAGE_TITLES[location.pathname] || "FlowDesk"
  const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "done")

  return (
    <header
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--card-bg)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", margin: 0 }}>{title}</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <Button style={{ padding: "7px 10px" }} onClick={() => setNotifOpen((o) => !o)}>
            <Icon name="bell" size={16} color="var(--text-muted)" />
            {highPriority.length > 0 && (
              <span
                style={{
                  position: "absolute", top: 6, right: 6,
                  width: 8, height: 8, borderRadius: "50%", background: "#EF4444",
                }}
              />
            )}
          </Button>

          {notifOpen && (
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 300, ...card, zIndex: 200 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
                High Priority Tasks
              </h4>
              {highPriority.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>All caught up! 🎉</p>
              ) : (
                highPriority.map((t) => (
                  <div key={t.id} style={{ padding: "6px 0", borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--text)" }}>
                    🔴 {t.title}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <Button style={{ padding: "7px 10px" }} onClick={toggleTheme}>
          <Icon name={dark ? "sun" : "moon"} size={16} color="var(--text-muted)" />
        </Button>

        <Avatar name="Pragya Agarwal" />
      </div>
    </header>
  )
}
