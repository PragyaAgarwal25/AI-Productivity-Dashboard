import { createContext, useContext, useState } from "react"
import { INITIAL_TASKS } from "../data/mockData"

const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS)

  function addTask(task) {
    setTasks((prev) => [...prev, { ...task, id: Date.now(), createdAt: Date.now() }])
  }

  function updateTask(id, updates) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function toggleTaskStatus(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
      )
    )
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTaskStatus }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  return useContext(TasksContext)
}
