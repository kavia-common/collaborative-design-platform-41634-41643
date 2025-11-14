import React from "react";
import SideNav from "../components/layout/SideNav";
import TopBar from "../components/layout/TopBar";
import "../components/layout/layout.css";

// PUBLIC_INTERFACE
export default function ComponentsLib() {
  return (
    <div className="app-shell">
      <SideNav />
      <TopBar />
      <main className="content" style={{ display: "block", padding: 16 }}>
        <h2>Components</h2>
        <p style={{ color: "var(--muted)" }}>
          This is a placeholder for reusable UI components. Future iterations can allow drag and drop onto the canvas.
        </p>
      </main>
    </div>
  );
}
