import { useState, useMemo } from "react"
import Card from "../components/ui/Card"
import Icon from "../components/ui/Icon"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import Modal from "../components/ui/Modal"
import { useTasks } from "../context/TasksContext"
import { useDebounce } from "../hooks/useDebounce"
import {
  TAGS, PRIORITIES, STATUSES,
  priorityColor, priorityBg, tagColor, statusLabel,
} from "../utils/helpers"
import { input } from "../styles/shared"

function TaskForm({ form, setForm, onSave, onCancel, isEdit }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        placeholder="Task title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        style={input}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} style={input}>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} style={input}>
          {TAGS.filter((t) => t !== "All").map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input
          type="date"
          value={form.due}
          onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
          style={input}
        />
        <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} style={input}>
          {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Button style={{ flex: 1, justifyContent: "center" }} onClick={onCancel}>Cancel</Button>
        <Button variant="primary" style={{ flex: 1, justifyContent: "center" }} onClick={onSave}>
          {isEdit ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </div>
  )
}

const EMPTY_FORM = { title: "", priority: "medium", tag: "Work", due: "", status: "todo" }

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useTasks()
  const [search, setSearch]     = useState("")
  const [filter, setFilter]     = useState("All")
  const [sort, setSort]         = useState("createdAt")
  const [viewMode, setViewMode] = useState("list")
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)

  const debouncedSearch = useDebounce(search, 300)

  const filtered = useMemo(() => {
    let out = [...tasks]
    if (debouncedSearch) out = out.filter((t) => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
    if (filter !== "All") out = out.filter((t) => t.tag === filter)
    out.sort((a, b) => {
      if (sort === "priority") return PRIORITIES.indexOf(b.priority) - PRIORITIES.indexOf(a.priority)
      if (sort === "due")      return new Date(a.due) - new Date(b.due)
      return b.createdAt - a.createdAt
    })
    return out
  }, [tasks, debouncedSearch, filter, sort])

  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter((t) => t.status === s)
    return acc
  }, {})

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowModal(true)
  }
  function openEdit(t) {
    setForm({ title: t.title, priority: t.priority, tag: t.tag, due: t.due, status: t.status })
    setEditId(t.id)
    setShowModal(true)
  }
  function handleSave() {
    if (!form.title.trim()) return
    editId ? updateTask(editId, form) : addTask(form)
    setShowModal(false)
  }

  const statusDot = { done: "#10B981", "in-progress": "#06B6D4", todo: "#94A3B8" }

  return (
    <div className="fade-in">
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>Tasks</h2>
        <Button variant="primary" onClick={openAdd}>
          <Icon name="plus" size={15} color="#fff" /> Add Task
        </Button>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={14} color="var(--text-muted)" />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            style={{ ...input, paddingLeft: 32 }}
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...input, width: "auto" }}>
          {TAGS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ ...input, width: "auto" }}>
          <option value="createdAt">Latest</option>
          <option value="priority">Priority</option>
          <option value="due">Due Date</option>
        </select>
        <div style={{ display: "flex", gap: 4 }}>
          {["list", "grid"].map((v) => (
            <Button key={v} variant={viewMode === v ? "primary" : "ghost"} onClick={() => setViewMode(v)} style={{ padding: "7px 10px" }}>
              <Icon name={v} size={15} color={viewMode === v ? "#fff" : "var(--text-muted)"} />
            </Button>
          ))}
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {STATUSES.map((s) => (
            <Card key={s}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusDot[s] }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{statusLabel[s]}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>({grouped[s].length})</span>
              </div>
              {grouped[s].length === 0 && (
                <p style={{ fontSize: 13, color: "var(--text-muted)", padding: "4px 0" }}>No tasks here</p>
              )}
              {grouped[s].map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: "1px solid var(--border)" }}>
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `2px solid ${t.status === "done" ? "#10B981" : "var(--border)"}`,
                      background: t.status === "done" ? "#10B981" : "transparent",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    {t.status === "done" && <Icon name="check" size={10} color="#fff" />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 14,
                      color: t.status === "done" ? "var(--text-muted)" : "var(--text)",
                      textDecoration: t.status === "done" ? "line-through" : "none",
                    }}>
                      {t.title}
                    </span>
                    {t.due && <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>Due {t.due}</span>}
                  </div>
                  <Badge color={priorityColor[t.priority]} bg={priorityBg[t.priority]}>{t.priority}</Badge>
                  <Badge color={tagColor[t.tag]} bg={tagColor[t.tag] + "15"}>{t.tag}</Badge>
                  <Button onClick={() => openEdit(t)} style={{ padding: "4px 6px" }}><Icon name="edit" size={13} /></Button>
                  <Button onClick={() => deleteTask(t.id)} style={{ padding: "4px 6px" }}><Icon name="trash" size={13} color="#EF4444" /></Button>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {filtered.map((t) => (
            <Card key={t.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Badge color={tagColor[t.tag]} bg={tagColor[t.tag] + "15"}>{t.tag}</Badge>
                <Badge color={priorityColor[t.priority]} bg={priorityBg[t.priority]}>{t.priority}</Badge>
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", margin: 0 }}>{t.title}</p>
              {t.due && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Due {t.due}</span>}
              <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                <Button onClick={() => toggleTaskStatus(t.id)} style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>
                  {t.status === "done" ? "Undo" : "Complete"}
                </Button>
                <Button onClick={() => deleteTask(t.id)} style={{ padding: "4px 8px" }}>
                  <Icon name="trash" size={13} color="#EF4444" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal title={editId ? "Edit Task" : "Add Task"} onClose={() => setShowModal(false)}>
          <TaskForm form={form} setForm={setForm} onSave={handleSave} onCancel={() => setShowModal(false)} isEdit={!!editId} />
        </Modal>
      )}
    </div>
  )
}
