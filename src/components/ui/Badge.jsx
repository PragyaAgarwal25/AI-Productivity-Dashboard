import { badge } from "../../styles/shared"

export default function Badge({ color, bg, children }) {
  return <span style={badge(color, bg)}>{children}</span>
}
