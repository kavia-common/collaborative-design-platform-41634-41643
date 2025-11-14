import React, { useMemo } from "react";
import "../layout/layout.css";
import { useDesignActions, useDesignState } from "../../state/DesignContext";

// PUBLIC_INTERFACE
export default function PropertiesPanel() {
  const { layers, selectedId } = useDesignState();
  const actions = useDesignActions();
  const layer = useMemo(() => layers.find((l) => l.id === selectedId), [layers, selectedId]);

  const update = (key, val) => {
    if (!layer) return;
    const numKeys = ["x", "y", "w", "h"];
    const v = numKeys.includes(key) ? Number(val) || 0 : val;
    actions.updateLayerProps(layer.id, { [key]: v });
  };

  return (
    <div className="panel">
      <h3>Properties</h3>
      {!layer ? (
        <div style={{ color: "var(--muted)" }}>Select a layer to edit its properties</div>
      ) : (
        <div>
          <div className="form-row">
            <label>Name</label>
            <input className="input" value={layer.name} onChange={(e) => actions.renameLayer(layer.id, e.target.value)} />
          </div>
          <div className="form-row">
            <label>X</label>
            <input className="input" type="number" value={layer.x} onChange={(e) => update("x", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Y</label>
            <input className="input" type="number" value={layer.y} onChange={(e) => update("y", e.target.value)} />
          </div>
          {layer.type !== "text" && (
            <>
              <div className="form-row">
                <label>W</label>
                <input className="input" type="number" value={layer.w} onChange={(e) => update("w", e.target.value)} />
              </div>
              <div className="form-row">
                <label>H</label>
                <input className="input" type="number" value={layer.h} onChange={(e) => update("h", e.target.value)} />
              </div>
            </>
          )}
          <div className="form-row">
            <label>Fill</label>
            <input className="input" type="color" value={layer.fill} onChange={(e) => update("fill", e.target.value)} />
          </div>
          {layer.type === "text" && (
            <div className="form-row">
              <label>Text</label>
              <input className="input" value={layer.text || ""} onChange={(e) => update("text", e.target.value)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
