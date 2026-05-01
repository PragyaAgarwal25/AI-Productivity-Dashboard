import { card } from "../../styles/shared"

export default function Card({ children, style = {}, onClick }) {
  return (
    <div style={{ ...card, ...style }} onClick={onClick}>
      {children}
    </div>
  )
}
