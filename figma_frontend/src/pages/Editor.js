import React from "react";
import SideNav from "../components/layout/SideNav";
import TopBar from "../components/layout/TopBar";
import Toolbar from "../components/editor/Toolbar";
import Canvas from "../components/editor/Canvas";
import LayersPanel from "../components/editor/LayersPanel";
import PropertiesPanel from "../components/editor/PropertiesPanel";
import "../components/layout/layout.css";

// PUBLIC_INTERFACE
export default function Editor() {
  return (
    <div className="app-shell">
      <SideNav />
      <TopBar />
      <main className="content">
        <Toolbar />
        <Canvas />
        <div className="inspector">
          <LayersPanel />
          <PropertiesPanel />
        </div>
      </main>
    </div>
  );
}
