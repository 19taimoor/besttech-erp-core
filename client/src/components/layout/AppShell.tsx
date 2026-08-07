import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import "./AppShell.css";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} />
      <div className="app-shell-main">
        <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="app-shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
