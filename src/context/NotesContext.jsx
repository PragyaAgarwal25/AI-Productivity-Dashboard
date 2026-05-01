import { createContext, useContext, useState } from "react"
import { INITIAL_NOTES } from "../data/mockData"

const NotesContext = createContext(null)

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(INITIAL_NOTES)

  function addNote(note) {
    setNotes((prev) => [{ ...note, id: Date.now(), pinned: false, createdAt: Date.now() }, ...prev])
  }

  function updateNote(id, updates) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)))
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  function togglePin(id) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))
  }

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, togglePin }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  return useContext(NotesContext)
}
