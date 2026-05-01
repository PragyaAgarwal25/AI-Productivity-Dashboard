import Card from "./Card"
import Button from "./Button"
import Icon from "./Icon"

export default function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "#00000060",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <Card style={{ width: 460, background: "var(--card-bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{title}</h3>
          <Button onClick={onClose} style={{ padding: "4px 8px" }}>
            <Icon name="close" size={16} />
          </Button>
        </div>
        {children}
      </Card>
    </div>
  )
}
