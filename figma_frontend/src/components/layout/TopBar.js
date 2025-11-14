import React from "react";
import "./layout.css";
import { useDesignActions, useDesignState } from "../../state/DesignContext";

// PUBLIC_INTERFACE
export default function TopBar() {
  const actions = useDesignActions();
  const state = useDesignState();
  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="topbar__title">{state.docName}</div>
        <div className="topbar__subtitle">API: {process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE || "n/a"}</div>
      </div>
      <div className="topbar__right">
        <button className="btn" onClick={actions.undo} title="Undo (placeholder)">↶ Undo</button>
        <button className="btn" onClick={actions.redo} title="Redo (placeholder)">↷ Redo</button>
        <button className="btn btn-primary" title="Share (placeholder)">Share</button>
      </div>
    </header>
  );
}
