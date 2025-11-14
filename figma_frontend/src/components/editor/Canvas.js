import React, { useCallback, useMemo, useRef, useState } from "react";
import "../layout/layout.css";
import { useDesignActions, useDesignState, Tool } from "../../state/DesignContext";

// Helpers to constrain and create shapes
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// PUBLIC_INTERFACE
export default function Canvas() {
  const { layers, selectedId, tool } = useDesignState();
  const actions = useDesignActions();

  const svgRef = useRef(null);
  const [drag, setDrag] = useState(null); // {id, offsetX, offsetY}

  const boardSize = useMemo(() => ({ width: 1200, height: 800 }), []);

  const hitLayerAt = useCallback(
    (x, y) => {
      // Simple hit-test in reverse order (top-most first)
      for (let i = layers.length - 1; i >= 0; i--) {
        const l = layers[i];
        if (l.type === "rect" || l.type === "text") {
          if (x >= l.x && x <= l.x + l.w && y >= l.y && y <= l.y + l.h) return l;
        } else if (l.type === "ellipse") {
          // normalizing point to ellipse equation ((x-h)^2)/rx^2 + ((y-k)^2)/ry^2 <= 1
          const rx = l.w / 2;
          const ry = l.h / 2;
          const h = l.x + rx;
          const k = l.y + ry;
          const val = ((x - h) * (x - h)) / (rx * rx) + ((y - k) * (y - k)) / (ry * ry);
          if (val <= 1) return l;
        }
      }
      return null;
    },
    [layers]
  );

  const toLocal = useCallback((evt) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: cursor.x, y: cursor.y };
  }, []);

  const onDown = (e) => {
    const { x, y } = toLocal(e);
    if (tool === Tool.SELECT) {
      const hit = hitLayerAt(x, y);
      if (hit) {
        actions.selectLayer(hit.id);
        setDrag({ id: hit.id, offsetX: x - hit.x, offsetY: y - hit.y });
      } else {
        actions.selectLayer(null);
      }
    } else if (tool === Tool.RECT) {
      const w = 120,
        h = 80;
      const nx = clamp(x - w / 2, 0, boardSize.width - w);
      const ny = clamp(y - h / 2, 0, boardSize.height - h);
      actions.addRect(nx, ny, w, h);
    } else if (tool === Tool.ELLIPSE) {
      const w = 120,
        h = 120;
      const nx = clamp(x - w / 2, 0, boardSize.width - w);
      const ny = clamp(y - h / 2, 0, boardSize.height - h);
      actions.addEllipse(nx, ny, w, h);
    } else if (tool === Tool.TEXT) {
      const nx = clamp(x, 0, boardSize.width - 120);
      const ny = clamp(y, 0, boardSize.height - 24);
      actions.addText(nx, ny);
    }
  };

  const onMove = (e) => {
    if (!drag) return;
    const { x, y } = toLocal(e);
    const nx = clamp(x - drag.offsetX, 0, boardSize.width - 1);
    const ny = clamp(y - drag.offsetY, 0, boardSize.height - 1);
    actions.moveLayer(drag.id, nx, ny);
  };

  const onUp = () => {
    setDrag(null);
  };

  const selection = useMemo(() => layers.find((l) => l.id === selectedId), [layers, selectedId]);

  return (
    <div className="canvas-wrap">
      <div className="canvas-topbar">Canvas • Tool: {tool}</div>
      <div className="canvas-area" onMouseLeave={onUp}>
        <svg
          ref={svgRef}
          className="canvas-board"
          role="img"
          aria-label="Design Canvas"
          width={boardSize.width}
          height={boardSize.height}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
        >
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e2332" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {layers.map((l) => {
            if (l.type === "rect") {
              return (
                <g key={l.id}>
                  <rect x={l.x} y={l.y} width={l.w} height={l.h} fill={l.fill} rx="6" />
                  {selectedId === l.id && (
                    <rect
                      x={l.x - 2}
                      y={l.y - 2}
                      width={l.w + 4}
                      height={l.h + 4}
                      fill="none"
                      stroke="#7c5cff"
                      strokeDasharray="4 2"
                    />
                  )}
                </g>
              );
            }
            if (l.type === "ellipse") {
              const cx = l.x + l.w / 2;
              const cy = l.y + l.h / 2;
              return (
                <g key={l.id}>
                  <ellipse cx={cx} cy={cy} rx={l.w / 2} ry={l.h / 2} fill={l.fill} />
                  {selectedId === l.id && (
                    <rect
                      x={l.x - 2}
                      y={l.y - 2}
                      width={l.w + 4}
                      height={l.h + 4}
                      fill="none"
                      stroke="#7c5cff"
                      strokeDasharray="4 2"
                    />
                  )}
                </g>
              );
            }
            if (l.type === "text") {
              return (
                <g key={l.id}>
                  <text x={l.x} y={l.y + 16} fill={l.fill} fontFamily="Inter, system-ui, sans-serif" fontSize="16">
                    {l.text || "Text"}
                  </text>
                  {selectedId === l.id && (
                    <rect
                      x={l.x - 2}
                      y={l.y - 2}
                      width={l.w + 4}
                      height={l.h + 4}
                      fill="none"
                      stroke="#7c5cff"
                      strokeDasharray="4 2"
                    />
                  )}
                </g>
              );
            }
            return null;
          })}
          {/* selection outline for canvas */}
          {selection && selection.type === "text" ? null : null}
        </svg>
      </div>
      <div style={{ padding: "6px 12px", color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        WS: {process.env.REACT_APP_WS_URL ? "configured" : "not set"}
      </div>
    </div>
  );
}
