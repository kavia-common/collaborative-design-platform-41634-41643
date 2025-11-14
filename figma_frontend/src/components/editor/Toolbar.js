import React from "react";
import "../layout/layout.css";
import { useDesignActions, useDesignState, Tool } from "../../state/DesignContext";

// PUBLIC_INTERFACE
export default function Toolbar() {
  const actions = useDesignActions();
  const state = useDesignState();
  const buttons = [
    { tool: Tool.SELECT, label: "Select", icon: "🖱️" },
    { tool: Tool.RECT, label: "Rectangle", icon: "▭" },
    { tool: Tool.ELLIPSE, label: "Ellipse", icon: "◯" },
    { tool: Tool.TEXT, label: "Text", icon: "T" },
  ];
  return (
    <div className="toolbar">
      {buttons.map((b) => (
        <button
          key={b.tool}
          className={`btn btn-toggle ${state.tool === b.tool ? "active" : ""}`}
          onClick={() => actions.setTool(b.tool)}
          title={b.label}
          aria-pressed={state.tool === b.tool}
        >
          {b.icon}
        </button>
      ))}
      <hr style={{ borderColor: "var(--border)", width: "100%" }} />
      <button className="btn btn-toggle" onClick={() => actions.addRect()}>+ Rect</button>
      <button className="btn btn-toggle" onClick={() => actions.addEllipse()}>+ Ellipse</button>
      <button className="btn btn-toggle" onClick={() => actions.addText()}>+ Text</button>
    </div>
  );
}
