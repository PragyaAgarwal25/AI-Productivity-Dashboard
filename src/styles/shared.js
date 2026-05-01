export const card = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 20,
  transition: "box-shadow 0.2s",
}

export const btn = (variant = "ghost") => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: variant === "primary" ? "8px 16px" : "7px 14px",
  borderRadius: 10,
  border: variant === "primary" ? "none" : "1px solid var(--border)",
  background: variant === "primary" ? "var(--accent)" : "transparent",
  color: variant === "primary" ? "#fff" : "var(--text-muted)",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.15s",
  fontFamily: "inherit",
})

export const input = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--input-bg)",
  color: "var(--text)",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
}

export const badge = (color, bg) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 600,
  background: bg,
  color: color,
  letterSpacing: "0.02em",
})

export const navItem = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 16px",
  borderRadius: 12,
  margin: "2px 8px",
  cursor: "pointer",
  background: active ? "var(--accent-light)" : "transparent",
  color: active ? "var(--accent)" : "var(--text-muted)",
  fontWeight: active ? 600 : 400,
  fontSize: 14,
  transition: "all 0.15s",
  whiteSpace: "nowrap",
  overflow: "hidden",
})
