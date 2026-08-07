import { NavLink } from "react-router-dom";
import "./Sidebar.css";

interface NavItem {
  label: string;
  to?: string;
  icon: string;
  comingSoon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: "📊" },
  { label: "Users", to: "/users", icon: "👥" },
  { label: "Inventory", icon: "📦", comingSoon: true },
  { label: "Products", icon: "🏷️", comingSoon: true },
  { label: "Warehouses", icon: "🏬", comingSoon: true },
  { label: "Scan", icon: "🔍", comingSoon: true },
  { label: "Reports", icon: "📈", comingSoon: true },
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside className={`sidebar ${isOpen ? "" : "sidebar-collapsed"}`}>
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">B</span>
        {isOpen && <span className="sidebar-brand-name">BestTech ERP</span>}
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) =>
          item.comingSoon ? (
            <span key={item.label} className="sidebar-link sidebar-link-disabled" title="Coming soon">
              <span className="sidebar-icon">{item.icon}</span>
              {isOpen && (
                <>
                  <span className="sidebar-label">{item.label}</span>
                  <span className="sidebar-soon">Soon</span>
                </>
              )}
            </span>
          ) : (
            <NavLink
              key={item.label}
              to={item.to!}
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {isOpen && <span className="sidebar-label">{item.label}</span>}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
