import React from "react";
import SideNav from "../components/layout/SideNav";
import TopBar from "../components/layout/TopBar";
import "../components/layout/layout.css";

// PUBLIC_INTERFACE
export default function Dashboard() {
  return (
    <div className="app-shell">
      <SideNav />
      <TopBar />
      <main className="content" style={{ display: "block", padding: 16 }}>
        <h2>Dashboard</h2>
        <p style={{ color: "var(--muted)" }}>
          Welcome to the collaborative design platform. Use the Editor to create shapes and manage layers.
        </p>
        <div style={{ marginTop: 12 }}>
          <a className="btn btn-primary" href="/editor">Open Editor</a>
        </div>
      </main>
    </div>
  );
}
