# Figma-like Editor Frontend

This React app provides a lightweight scaffold for a Figma-like editor with a modular layout and simple SVG-based drawing.

## Quick Start

- Install dependencies: `npm install`
- Start development server: `npm start`
- Open http://localhost:3000

Environment variables (already supported, do not add new ones):
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_PORT (Create React App uses port 3000 by default)
Other REACT_APP_* are read if present.

## Pages

- / (Dashboard)
- /editor (Main editor)
- /components (Components library placeholder)

## Layout

- Left SideNav: navigation
- Top TopBar: actions and context
- Center Canvas: SVG drawing board with grid
- Right Inspector: Layers panel and Properties panel

## Drawing Tools

- Select: Click to select, drag to move shapes
- Rectangle: Click canvas to create
- Ellipse: Click canvas to create
- Text: Click canvas to create text element

Inspector lets you edit x, y, width, height, fill color, and text content (for text shapes). Undo/Redo are implemented with a simple in-memory history.

## State Management

- React Context + Reducer in `src/state/DesignContext.js`
- In-memory only; no persistence

## WebSocket Placeholder

If `REACT_APP_WS_URL` is set, the app creates a WebSocket connection on load (no external interactions yet).

## Project Structure

- src/state: Design context and actions
- src/components/layout: SideNav, TopBar, shared layout.css
- src/components/editor: Toolbar, Canvas (SVG), LayersPanel, PropertiesPanel
- src/pages: Dashboard, Editor, ComponentsLib

## Notes

- Uses only React and react-router-dom for routing
- No external APIs required
