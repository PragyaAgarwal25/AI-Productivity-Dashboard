import { useState, useMemo } from "react"
import Card from "../components/ui/Card"
import Icon from "../components/ui/Icon"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { useNotes } from "../context/NotesContext"
import { useDebounce } from "../hooks/useDebounce"
import { TAGS, tagColor, formatDate } from "../utils/helpers"
import { input } from "../styles/shared"

const EMPTY_FORM = { title: "", content: "", tag: "Work" }

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote, togglePin } = useNotes()
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState("All")
  const [activeNote, setActiveNote] = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [isNew, setIsNew]         = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const filtered = useMemo(() => {
    let out = [...notes]
    if (debouncedSearch) {
      out = out.filter(
        (n) =>
          n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          n.content.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }
    if (filter !== "All") out = out.filter((n) => n.tag === filter)
    return out.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
  }, [notes, debouncedSearch, filter])

  function openNote(n) {
    setActiveNote(n)
    setForm({ title: n.title, content: n.content, tag: n.tag })
    setIsNew(false)
  }

  function newNote() {
    setActiveNote({ id: null })
    setForm(EMPTY_FORM)
    setIsNew(true)
  }

  function handleSave() {
    if (!form.title.trim()) return
    if (isNew) {
      addNote(form)
    } else {
      updateNote(activeNote.id, form)
    }
    setActiveNote(null)
  }

  function handleDelete(id) {
    deleteNote(id)
    if (activeNote?.id === id) setActiveNote(null)
  }

  return (
    <div className="fade-in" style={{ display: "flex", gap: 20, height: "calc(100vh - 140px)" }}>
      {/* Sidebar panel */}
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
        {/* Controls */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}>
              <Icon name="search" size={13} color="var(--text-muted)" />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes…"
              style={{ ...input, paddingLeft: 28, fontSize: 13 }}
            />
          </div>
          <Button variant="primary" onClick={newNote} style={{ padding: "7px 10px" }}>
            <Icon name="plus" size={15} color="#fff" />
          </Button>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={input}>
          {TAGS.map((t) => <option key={t}>{t}</option>)}
        </select>

        {/* Note list */}
        <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", marginTop: 20 }}>No notes found</p>
          )}
          {filtered.map((n) => (
            <Card
              key={n.id}
              onClick={() => openNote(n)}
              style={{
                padding: "12px 14px",
                cursor: "pointer",
                border: activeNote?.id === n.id ? "1px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: "var(--text)",
                  flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {n.title}
                </span>
                <div style={{ display: "flex", gap: 3, marginLeft: 4 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin(n.id) }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 3px", display: "flex" }}
                  >
                    <Icon name="pin" size={12} color={n.pinned ? "var(--accent)" : "var(--text-muted)"} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(n.id) }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 3px", display: "flex" }}
                  >
                    <Icon name="trash" size={12} color="#EF4444" />
                  </button>
                </div>
              </div>
              <p style={{
                fontSize: 12, color: "var(--text-muted)", margin: "0 0 6px",
                overflow: "hidden", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              }}>
                {n.content}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Badge color={tagColor[n.tag]} bg={tagColor[n.tag] + "15"}>{n.tag}</Badge>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{formatDate(n.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Editor panel */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeNote ? (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Note title…"
                style={{ ...input, fontSize: 17, fontWeight: 600, border: "none", padding: "4px 0", background: "transparent", flex: 1 }}
              />
              <select
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                style={{ ...input, width: "auto" }}
              >
                {TAGS.filter((t) => t !== "All").map((t) => <option key={t}>{t}</option>)}
              </select>
              <Button variant="primary" onClick={handleSave}>Save</Button>
            </div>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Start writing your note…"
              style={{ ...input, flex: 1, resize: "none", lineHeight: 1.7 }}
            />
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--text-muted)" }}>
            <Icon name="notes" size={40} color="var(--border)" />
            <p style={{ marginTop: 12, fontSize: 14 }}>Select a note or create a new one</p>
            <Button variant="primary" onClick={newNote} style={{ marginTop: 10 }}>
              <Icon name="plus" size={15} color="#fff" /> New Note
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
