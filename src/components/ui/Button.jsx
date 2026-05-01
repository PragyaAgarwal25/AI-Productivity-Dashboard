import { btn } from "../../styles/shared"

export default function Button({ variant = "ghost", onClick, children, style = {}, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...btn(variant), ...style, opacity: disabled ? 0.6 : 1 }}
    >
      {children}
    </button>
  )
}
