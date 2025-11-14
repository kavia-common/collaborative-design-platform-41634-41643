import React, { useState } from "react";
import "../layout/layout.css";
import { useDesignActions, useDesignState } from "../../state/DesignContext";

// PUBLIC_INTERFACE
export default function LayersPanel() {
  const { layers, selectedId } = useDesignState();
  const actions = useDesignActions();
  const [editingId, setEditingId] = useState(null);
  const [temp, setTemp] = useState("");

  const startEdit = (l) => {
    setEditingId(l.id);
    setTemp(l.name);
  };
  const commit = (id) => {
    actions.renameLayer(id, temp.trim() || "Layer");
    setEditingId(null);
    setTemp("");
  };

  return (
    <div className="panel">
      <h3>Layers</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {layers.length === 0 && <div className="layer-item">No layers yet</div>}
        {layers.map((l) => (
          <div
            key={l.id}
            className={`layer-item ${selectedId === l.id ? "active" : ""}`}
            onClick={() => actions.selectLayer(l.id)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.fill }} />
              {editingId === l.id ? (
                <input
                  className="input"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  onBlur={() => commit(l.id)}
                  onKeyDown={(e) => e.key === "Enter" && commit(l.id)}
                  autoFocus
                />
              ) : (
                <div onDoubleClick={() => startEdit(l)}>
                  {l.name} <small style={{ color: "var(--muted)" }}>({l.type})</small>
                </div>
              )}
            </div>
            <button className="btn" onClick={(e) => { e.stopPropagation(); actions.deleteLayer(l.id); }}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
