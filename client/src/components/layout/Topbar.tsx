import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import "./Topbar.css";

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  }

  return (
    <header className="topbar">
      <button className="topbar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        ☰
      </button>
      <div className="topbar-spacer" />
      <div className="topbar-user">
        <button className="topbar-user-trigger" onClick={() => setMenuOpen((v) => !v)}>
          <span className="topbar-avatar">{user?.name?.charAt(0).toUpperCase() ?? "?"}</span>
          <span className="topbar-user-name">{user?.name}</span>
        </button>
        {menuOpen && (
          <div className="topbar-menu" onMouseLeave={() => setMenuOpen(false)}>
            <span className="topbar-menu-role">{user?.role.displayName}</span>
            <Link to="/profile" className="topbar-menu-item" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <Link to="/settings" className="topbar-menu-item" onClick={() => setMenuOpen(false)}>
              Settings
            </Link>
            <button className="topbar-menu-item topbar-menu-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
