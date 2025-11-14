import React, { createContext, useContext, useReducer, useMemo, useEffect, useRef } from "react";

/**
 * Types
 * Layer types: 'rect' | 'ellipse' | 'text'
 * Layer shape: {
 *   id: string,
 *   type: string,
 *   name: string,
 *   x: number, y: number, w: number, h: number,
 *   fill: string,
 *   text?: string
 * }
 */

const DesignStateContext = createContext(null);
const DesignDispatchContext = createContext(null);

// PUBLIC_INTERFACE
export const Tool = {
  SELECT: "select",
  RECT: "rect",
  ELLIPSE: "ellipse",
  TEXT: "text",
};

const initialState = {
  docName: "Untitled",
  layers: [],
  selectedId: null,
  tool: Tool.SELECT,
  // Simple history stacks for undo/redo placeholders
  history: [],
  future: [],
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function pushHistory(state) {
  // Push a snapshot of layers and selection to history
  const snapshot = { layers: state.layers, selectedId: state.selectedId };
  return {
    ...state,
    history: [...state.history, snapshot],
    future: [], // clear redo stack on new action
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_TOOL":
      return { ...state, tool: action.tool };
    case "ADD_LAYER": {
      const next = pushHistory(state);
      return {
        ...next,
        layers: [...next.layers, action.layer],
        selectedId: action.layer.id,
      };
    }
    case "SELECT_LAYER":
      return { ...state, selectedId: action.id };
    case "MOVE_LAYER": {
      const { id, x, y } = action;
      const next = pushHistory(state);
      return {
        ...next,
        layers: next.layers.map((l) => (l.id === id ? { ...l, x, y } : l)),
      };
    }
    case "UPDATE_LAYER_PROPS": {
      const { id, props } = action;
      const next = pushHistory(state);
      return {
        ...next,
        layers: next.layers.map((l) => (l.id === id ? { ...l, ...props } : l)),
      };
    }
    case "RENAME_LAYER": {
      const { id, name } = action;
      const next = pushHistory(state);
      return {
        ...next,
        layers: next.layers.map((l) => (l.id === id ? { ...l, name } : l)),
      };
    }
    case "DELETE_LAYER": {
      const next = pushHistory(state);
      const filtered = next.layers.filter((l) => l.id !== action.id);
      const nextSelected =
        next.selectedId === action.id ? null : next.selectedId;
      return {
        ...next,
        layers: filtered,
        selectedId: nextSelected,
      };
    }
    case "UNDO": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      const futureSnap = { layers: state.layers, selectedId: state.selectedId };
      return {
        ...state,
        layers: prev.layers,
        selectedId: prev.selectedId,
        history: newHistory,
        future: [futureSnap, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const nextSnap = state.future[0];
      const rest = state.future.slice(1);
      const historySnap = { layers: state.layers, selectedId: state.selectedId };
      return {
        ...state,
        layers: nextSnap.layers,
        selectedId: nextSnap.selectedId,
        history: [...state.history, historySnap],
        future: rest,
      };
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function DesignProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // WebSocket placeholder for future collaboration
  const wsRef = useRef(null);
  useEffect(() => {
    const wsUrl = process.env.REACT_APP_WS_URL;
    if (!wsUrl) return; // optional, no external service required
    try {
      wsRef.current = new WebSocket(wsUrl);
      wsRef.current.onopen = () => {
        // Placeholder: announce presence
        wsRef.current && wsRef.current.send(JSON.stringify({ type: "hello", doc: state.docName }));
      };
      wsRef.current.onmessage = () => {
        // Placeholder: ignore messages for now
      };
    } catch (e) {
      // Silently ignore connection issues for placeholder
      // console.warn("WS init failed", e);
    }
    return () => {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (_) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // init once

  const value = useMemo(() => state, [state]);
  const actions = useMemo(
    () => ({
      // PUBLIC_INTERFACE
      setTool: (tool) => dispatch({ type: "SET_TOOL", tool }),
      // PUBLIC_INTERFACE
      addRect: (x = 100, y = 100, w = 120, h = 80, fill = "#6C5CE7") =>
        dispatch({
          type: "ADD_LAYER",
          layer: { id: makeId(), type: "rect", name: "Rectangle", x, y, w, h, fill },
        }),
      // PUBLIC_INTERFACE
      addEllipse: (x = 200, y = 140, w = 120, h = 120, fill = "#00D1B2") =>
        dispatch({
          type: "ADD_LAYER",
          layer: { id: makeId(), type: "ellipse", name: "Ellipse", x, y, w, h, fill },
        }),
      // PUBLIC_INTERFACE
      addText: (x = 160, y = 160, text = "Text", fill = "#111111") =>
        dispatch({
          type: "ADD_LAYER",
          layer: { id: makeId(), type: "text", name: "Text", x, y, w: 120, h: 24, fill, text },
        }),
      // PUBLIC_INTERFACE
      selectLayer: (id) => dispatch({ type: "SELECT_LAYER", id }),
      // PUBLIC_INTERFACE
      moveLayer: (id, x, y) => dispatch({ type: "MOVE_LAYER", id, x, y }),
      // PUBLIC_INTERFACE
      updateLayerProps: (id, props) => dispatch({ type: "UPDATE_LAYER_PROPS", id, props }),
      // PUBLIC_INTERFACE
      renameLayer: (id, name) => dispatch({ type: "RENAME_LAYER", id, name }),
      // PUBLIC_INTERFACE
      deleteLayer: (id) => dispatch({ type: "DELETE_LAYER", id }),
      // PUBLIC_INTERFACE
      undo: () => dispatch({ type: "UNDO" }),
      // PUBLIC_INTERFACE
      redo: () => dispatch({ type: "REDO" }),
    }),
    []
  );

  return (
    <DesignStateContext.Provider value={value}>
      <DesignDispatchContext.Provider value={actions}>{children}</DesignDispatchContext.Provider>
    </DesignStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useDesignState() {
  const ctx = useContext(DesignStateContext);
  if (!ctx) throw new Error("useDesignState must be used within DesignProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function useDesignActions() {
  const ctx = useContext(DesignDispatchContext);
  if (!ctx) throw new Error("useDesignActions must be used within DesignProvider");
  return ctx;
}
