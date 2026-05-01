import { useState, useRef, useEffect } from "react"
import Card from "../components/ui/Card"
import Icon from "../components/ui/Icon"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { useTasks } from "../context/TasksContext"
import { useNotes } from "../context/NotesContext"
import { input } from "../styles/shared"

const QUICK_PROMPTS = [
  "Summarize my task status",
  "What should I prioritize today?",
  "Give me a productivity tip",
  "How many tasks are overdue?",
]

function ChatBubble({ msg }) {
  const isUser = msg.role === "user"
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: isUser ? "flex-end" : "flex-start" }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="ai" size={15} color="#fff" />
        </div>
      )}
      <div style={{
        maxWidth: "75%", padding: "10px 14px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser ? "var(--accent)" : "var(--bg)",
        color: isUser ? "#fff" : "var(--text)",
        fontSize: 14, lineHeight: 1.65,
        border: !isUser ? "1px solid var(--border)" : "none",
      }}>
        {msg.text}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: "var(--accent)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name="ai" size={15} color="#fff" />
      </div>
      <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AIAssistant() {
  const { tasks } = useTasks()
  const { notes } = useNotes()

  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI productivity assistant. I can help you with tasks, notes, scheduling, and productivity tips. What do you need?" },
  ])
  const [inputVal, setInputVal] = useState("")
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const systemPrompt = `You are FlowDesk's AI productivity assistant. Be concise and helpful (under 120 words per reply).
User stats:
- Total tasks: ${tasks.length}
- Done: ${tasks.filter((t) => t.status === "done").length}
- In Progress: ${tasks.filter((t) => t.status === "in-progress").length}  
- To Do: ${tasks.filter((t) => t.status === "todo").length}
- High priority pending: ${tasks.filter((t) => t.priority === "high" && t.status !== "done").map((t) => t.title).join(", ") || "none"}
- Notes: ${notes.length}
Today: ${new Date().toDateString()}`

  async function sendMessage() {
    const text = inputVal.trim()
    if (!text || loading) return
    setInputVal("")

    const userMsg = { role: "user", text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    // ... existing code
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use the environment variable here
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, 
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620", // Updated to a current model name
          max_tokens: 1000,
          system: systemPrompt,
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.text })),
        }),
      })
// ... rest of the code
      const data = await res.json()
      const reply = data.content?.map((c) => c.text).join("") || "Sorry, I could not process that."
      setMessages((prev) => [...prev, { role: "assistant", text: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Connection error. Please try again." }])
    }

    setLoading(false)
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>AI Assistant</h2>
        <Badge color="#10B981" bg="#ECFDF5">● Powered by Claude</Badge>
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {QUICK_PROMPTS.map((p) => (
          <Button key={p} onClick={() => setInputVal(p)} style={{ fontSize: 12 }}>
            {p}
          </Button>
        ))}
      </div>

      {/* Chat area */}
      <Card style={{ flex: 1, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </Card>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask anything about your productivity…"
          style={{ ...input, flex: 1 }}
        />
        <Button variant="primary" onClick={sendMessage} disabled={loading} style={{ padding: "9px 20px" }}>
          Send
        </Button>
      </div>
    </div>
  )
}
