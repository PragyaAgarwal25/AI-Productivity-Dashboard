import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Card from "../components/ui/Card"
import Icon from "../components/ui/Icon"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import ProgressRing from "../components/ui/ProgressRing"
import { useTasks } from "../context/TasksContext"
import { useNotes } from "../context/NotesContext"
import { getGreeting, tagColor, priorityColor } from "../utils/helpers"
import { AI_SUGGESTIONS } from "../data/mockData"

function StatCard({ label, value, icon, color }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 44, height: 44, borderRadius: 12,
          background: color + "20",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon name={icon} size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)" }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</div>
      </div>
    </Card>
  )
}

function AISuggestionCard({ navigate }) {
  const [idx, setIdx] = useState(0)
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setTyping(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % AI_SUGGESTIONS.length)
        setTyping(true)
      }, 3000)
    }, 2800)
    return () => clearTimeout(t)
  }, [idx])

  return (
    <Card style={{ background: "linear-gradient(135deg,#6C63FF15,#06B6D415)", border: "1px solid #6C63FF30" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="ai" size={16} color="#fff" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>AI Insight</span>
      </div>
      <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, minHeight: 70 }}>
        {AI_SUGGESTIONS[idx]}
        {typing && (
          <span style={{ display: "inline-block", width: 2, height: 14, background: "var(--accent)", marginLeft: 3, animation: "blink 1s steps(1) infinite" }} />
        )}
      </p>
      <Button variant="primary" onClick={() => navigate("/ai")} style={{ marginTop: 12, fontSize: 12 }}>
        Ask AI anything
      </Button>
    </Card>
  )
}

export default function Dashboard() {
  const { tasks } = useTasks()
  const { notes } = useNotes()
  const navigate = useNavigate()

  const total   = tasks.length
  const done    = tasks.filter((t) => t.status === "done").length
  const inprog  = tasks.filter((t) => t.status === "in-progress").length
  const todo    = tasks.filter((t) => t.status === "todo").length
  const high    = tasks.filter((t) => t.priority === "high" && t.status !== "done").length
  const progress = total ? Math.round((done / total) * 100) : 0

  const stats = [
    { label: "Total Tasks",   value: total,  icon: "tasks",     color: "#6C63FF" },
    { label: "In Progress",   value: inprog, icon: "lightning", color: "#06B6D4" },
    { label: "Completed",     value: done,   icon: "check",     color: "#10B981" },
    { label: "High Priority", value: high,   icon: "star",      color: "#EF4444" },
  ]

  const bars = [
    { label: "To Do",       count: todo,   color: "#94A3B8", pct: total ? (todo / total) * 100 : 0 },
    { label: "In Progress", count: inprog, color: "#06B6D4", pct: total ? (inprog / total) * 100 : 0 },
    { label: "Done",        count: done,   color: "#10B981", pct: progress },
  ]

  return (
    <div className="fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
          {getGreeting()}, Aryan 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Progress + AI */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Overall Progress</h3>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{progress}% complete</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative" }}>
              <ProgressRing value={progress} size={80} stroke={7} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                {progress}%
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {bars.map((b) => (
                <div key={b.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{b.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{b.count}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <AISuggestionCard navigate={navigate} />
      </div>

      {/* Recent Tasks + Pinned Notes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Recent Tasks</h3>
            <Button onClick={() => navigate("/tasks")}>View all</Button>
          </div>
          {tasks.slice(0, 5).map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: priorityColor[t.priority], flexShrink: 0 }} />
              <span style={{
                flex: 1, fontSize: 13,
                color: t.status === "done" ? "var(--text-muted)" : "var(--text)",
                textDecoration: t.status === "done" ? "line-through" : "none",
              }}>
                {t.title}
              </span>
              <Badge color={tagColor[t.tag]} bg={tagColor[t.tag] + "20"}>{t.tag}</Badge>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Pinned Notes</h3>
            <Button onClick={() => navigate("/notes")}>View all</Button>
          </div>
          {notes.filter((n) => n.pinned).map((n) => (
            <div key={n.id} style={{ padding: "10px 12px", borderRadius: 10, background: "var(--bg)", marginBottom: 8, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Icon name="pin" size={12} color="var(--accent)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{n.title}</span>
              </div>
              <p style={{
                fontSize: 12, color: "var(--text-muted)", margin: 0,
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              }}>
                {n.content}
              </p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
