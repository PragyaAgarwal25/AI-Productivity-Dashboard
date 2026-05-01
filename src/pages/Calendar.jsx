import { useState } from "react"
import Card from "../components/ui/Card"
import { EVENTS } from "../data/mockData"
import { eventColor } from "../utils/helpers"

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HOURS     = Array.from({ length: 11 }, (_, i) => i + 8) // 8am – 6pm

export default function Calendar() {
  const now = new Date()
  const [selectedDay, setSelectedDay] = useState(now.getDay())

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - now.getDay() + i)
    return d
  })

  const todayEvents = EVENTS.filter((e) => e.day === selectedDay)

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>Calendar</h2>
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
          {now.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Week strip */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {weekDates.map((d, i) => {
          const isToday = d.toDateString() === now.toDateString()
          const isSelected = selectedDay === i
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              style={{
                flex: 1, padding: "12px 8px", borderRadius: 12,
                border: "1px solid var(--border)",
                background: isSelected ? "var(--accent)" : isToday ? "var(--accent-light)" : "var(--card-bg)",
                color: isSelected ? "#fff" : "var(--text)",
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            >
              <div style={{ fontSize: 11, marginBottom: 4, opacity: 0.8 }}>{WEEK_DAYS[d.getDay()]}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{d.getDate()}</div>
              {EVENTS.filter((e) => e.day === i).length > 0 && (
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: isSelected ? "#fff" : "var(--accent)",
                  margin: "4px auto 0",
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Timeline */}
      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
          {weekDates[selectedDay]?.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
        </h3>

        {HOURS.map((h) => {
          const slotEvents = todayEvents.filter((e) => parseInt(e.time) === h)
          return (
            <div
              key={h}
              style={{
                display: "flex", gap: 12, minHeight: 48,
                borderTop: "1px solid var(--border)",
                alignItems: "flex-start", paddingTop: 6, paddingBottom: 6,
              }}
            >
              <span style={{ fontSize: 11, color: "var(--text-muted)", width: 40, flexShrink: 0, paddingTop: 2 }}>
                {h}:00
              </span>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                {slotEvents.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: "6px 10px", borderRadius: 8,
                      background: eventColor[ev.type] + "18",
                      borderLeft: `3px solid ${eventColor[ev.type]}`,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: eventColor[ev.type] }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{ev.time} · {ev.duration} min</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {todayEvents.length === 0 && (
          <p style={{ fontSize: 14, color: "var(--text-muted)", paddingLeft: 52, paddingTop: 8 }}>
            No events scheduled. Enjoy your free day! 🎉
          </p>
        )}
      </Card>
    </div>
  )
}
