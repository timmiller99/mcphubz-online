/*
 * MCPHubz Sandbox — useSavedTools Hook
 * Manages saving, loading, and deleting tools from localStorage
 */
import { useState, useEffect } from "react";

export type SavedTool = {
  id: string;
  name: string;
  mode: "mcp" | "webmcp";
  code: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "mcphubz_saved_tools";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function useSavedTools() {
  const [savedTools, setSavedTools] = useState<SavedTool[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever savedTools changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTools));
    } catch {
      // localStorage full or unavailable
    }
  }, [savedTools]);

  const saveTool = (name: string, mode: "mcp" | "webmcp", code: string): SavedTool => {
    const now = new Date().toISOString();
    const newTool: SavedTool = {
      id: generateId(),
      name,
      mode,
      code,
      createdAt: now,
      updatedAt: now,
    };
    setSavedTools((prev) => [newTool, ...prev]);
    return newTool;
  };

  const updateTool = (id: string, name: string, code: string): void => {
    setSavedTools((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, name, code, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const deleteTool = (id: string): void => {
    setSavedTools((prev) => prev.filter((t) => t.id !== id));
  };

  const loadTool = (id: string): SavedTool | undefined => {
    return savedTools.find((t) => t.id === id);
  };

  return { savedTools, saveTool, updateTool, deleteTool, loadTool };
}

// --- URL Share Encoding ---
// Encodes tool state into a URL-safe base64 string for shareable links

export function encodeToolToUrl(name: string, mode: "mcp" | "webmcp", code: string): string {
  const payload = JSON.stringify({ name, mode, code });
  const encoded = btoa(encodeURIComponent(payload));
  return encoded;
}

export function decodeToolFromUrl(encoded: string): { name: string; mode: "mcp" | "webmcp"; code: string } | null {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(decoded);
    if (parsed.name && parsed.mode && parsed.code) {
      return parsed as { name: string; mode: "mcp" | "webmcp"; code: string };
    }
    return null;
  } catch {
    return null;
  }
}
