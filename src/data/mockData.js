export const INITIAL_TASKS = [
  { id: 1, title: "Review capstone project requirements",  priority: "high",   status: "todo",        tag: "Work",   due: "2025-02-01", createdAt: Date.now() - 86400000 },
  { id: 2, title: "Set up React + Vite project structure", priority: "high",   status: "in-progress", tag: "Dev",    due: "2025-02-02", createdAt: Date.now() - 43200000 },
  { id: 3, title: "Design dashboard wireframes",           priority: "medium", status: "done",        tag: "Design", due: "2025-01-30", createdAt: Date.now() - 172800000 },
  { id: 4, title: "Integrate weather API",                 priority: "medium", status: "todo",        tag: "Dev",    due: "2025-02-05", createdAt: Date.now() },
  { id: 5, title: "Implement Redux Toolkit state",         priority: "low",    status: "todo",        tag: "Dev",    due: "2025-02-07", createdAt: Date.now() },
  { id: 6, title: "Write project documentation",           priority: "low",    status: "todo",        tag: "Work",   due: "2025-02-10", createdAt: Date.now() },
]

export const INITIAL_NOTES = [
  { id: 1, title: "Project Ideas",        content: "Use Context API for theme switching. Consider recharts for analytics. Redux Toolkit for tasks state.", tag: "Dev",    pinned: true,  createdAt: Date.now() - 86400000 },
  { id: 2, title: "Meeting Notes Jan 30", content: "Discussed API integration strategies. Weather API key obtained. Need to implement error boundaries.",  tag: "Work",   pinned: false, createdAt: Date.now() - 43200000 },
  { id: 3, title: "Design System",        content: "Primary: #6C63FF. Font: DM Sans. Card radius: 16px. Use glassmorphism for widgets.",                  tag: "Design", pinned: true,  createdAt: Date.now() - 3600000 },
]

export const EVENTS = [
  { id: 1, title: "Team Standup",        time: "09:00", duration: 30,  type: "meeting", day: 0 },
  { id: 2, title: "Capstone Review",     time: "11:00", duration: 60,  type: "work",    day: 0 },
  { id: 3, title: "Lunch Break",         time: "13:00", duration: 60,  type: "break",   day: 0 },
  { id: 4, title: "Code Review Session", time: "15:00", duration: 45,  type: "dev",     day: 1 },
  { id: 5, title: "Client Presentation", time: "14:00", duration: 90,  type: "meeting", day: 2 },
  { id: 6, title: "Deep Work Block",     time: "10:00", duration: 120, type: "work",    day: 3 },
]

export const AI_SUGGESTIONS = [
  "You have 3 overdue tasks. Want me to reschedule them?",
  "Your productivity peak is 10am–12pm based on task completion patterns.",
  "Consider breaking 'Integrate weather API' into smaller subtasks.",
  "You've completed 8 tasks this week. Great momentum!",
  "Block 2 hours tomorrow morning for your Dev tasks.",
]

export const WEATHER_DATA = {
  city: "New Delhi",
  temp: 24,
  feels: 22,
  condition: "Partly Cloudy",
  humidity: 65,
  wind: 12,
  forecast: [
    { day: "Mon", high: 26, low: 18, icon: "☀️" },
    { day: "Tue", high: 23, low: 17, icon: "🌤"  },
    { day: "Wed", high: 20, low: 15, icon: "🌧"  },
    { day: "Thu", high: 22, low: 16, icon: "⛅"  },
    { day: "Fri", high: 25, low: 19, icon: "☀️" },
  ],
}
