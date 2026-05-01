export const TAGS       = ["All", "Work", "Dev", "Design", "Personal"]
export const PRIORITIES = ["low", "medium", "high"]
export const STATUSES   = ["todo", "in-progress", "done"]

export const priorityColor = { high: "#EF4444", medium: "#F59E0B", low: "#10B981" }
export const priorityBg    = { high: "#FEF2F2", medium: "#FFFBEB", low: "#ECFDF5" }
export const tagColor      = { Work: "#6C63FF", Dev: "#06B6D4", Design: "#F472B6", Personal: "#8B5CF6", All: "#64748B" }
export const statusLabel   = { todo: "To Do", "in-progress": "In Progress", done: "Done" }
export const eventColor    = { meeting: "#6C63FF", work: "#06B6D4", dev: "#10B981", break: "#F59E0B" }

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
}

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}
