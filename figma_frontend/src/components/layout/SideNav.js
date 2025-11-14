import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./layout.css";

// PUBLIC_INTERFACE
export default function SideNav() {
  const loc = useLocation();
  const nav = [
    { to: "/", label: "Dashboard", icon: "🏠" },
    { to: "/editor", label: "Editor", icon: "✏️" },
    { to: "/components", label: "Components", icon: "📦" },
  ];
  return (
    <aside className="sidenav">
      <div className="sidenav__brand">KAVIA Design</div>
      <nav className="sidenav__nav">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} className={`sidenav__link ${loc.pathname === n.to ? "active" : ""}`}>
            <span className="sidenav__icon">{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidenav__footer">
        <small>Env: {process.env.REACT_APP_NODE_ENV || "dev"}</small>
      </div>
    </aside>
  );
}
