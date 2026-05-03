import { NavLink, useLocation } from "react-router-dom"
import Icon from "../ui/Icon"
import Avatar from "../ui/Avatar"
import { navItem } from "../../styles/shared"

const NAV_ITEMS = [
  { path: "/",         label: "Dashboard",    icon: "dashboard" },
  { path: "/tasks",    label: "Tasks",        icon: "tasks"     },
  { path: "/notes",    label: "Notes",        icon: "notes"     },
  { path: "/calendar", label: "Calendar",     icon: "calendar"  },
  { path: "/weather",  label: "Weather",      icon: "weather"   },
  { path: "/ai",       label: "AI Assistant", icon: "ai"        },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation()

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "18px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid var(--border)",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="lightning" size={18} color="#fff" />
        </div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", whiteSpace: "nowrap" }}>
            FlowDesk
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            marginLeft: "auto", border: "1px solid var(--border)", background: "transparent",
            borderRadius: 8, padding: "4px 6px", cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center",
          }}
        >
          <Icon name="chevron" size={13} color="var(--text-muted)"
            style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s" }}
          />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path)

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ""}
              style={{ textDecoration: "none" }}
            >
              <div style={navItem(isActive)}>
                <Icon
                  name={item.icon}
                  size={18}
                  color={isActive ? "var(--accent)" : "var(--text-muted)"}
                />
                {!collapsed && item.label}
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
        <div style={{ ...navItem(false), gap: 10 }}>
          <Avatar name="Pragya Agarwal" />
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap" }}>
                Pragya Agarwal
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Student</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
