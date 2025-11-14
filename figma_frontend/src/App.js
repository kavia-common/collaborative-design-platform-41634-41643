import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { DesignProvider } from "./state/DesignContext";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import ComponentsLib from "./pages/ComponentsLib";

/**
 * PUBLIC_INTERFACE
 * App: Root application with routing and design state provider.
 * Routes:
 * - /            Dashboard
 * - /editor      Editor
 * - /components  Components library
 */
function App() {
  return (
    <DesignProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/components" element={<ComponentsLib />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DesignProvider>
  );
}

export default App;
