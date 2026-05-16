"use client";

import { useEffect } from "react";
import { X, Keyboard } from "lucide-react";

const SHORTCUT_GROUPS = [
  {
    title: "General",
    shortcuts: [
      { keys: ["Ctrl", "S"], desc: "Save note" },
      { keys: ["Ctrl", "E"], desc: "Toggle preview / edit" },
      { keys: ["?"], desc: "Show keyboard shortcuts" },
    ],
  },
  {
    title: "Formatting",
    shortcuts: [
      { keys: ["Ctrl", "B"], desc: "Bold text" },
      { keys: ["Ctrl", "I"], desc: "Italic text" },
      { keys: ["Ctrl", "K"], desc: "Insert link" },
      { keys: ["Ctrl", "/"], desc: "Inline code" },
      { keys: ["Ctrl", "Shift", "X"], desc: "Strikethrough" },
      { keys: ["Ctrl", "Shift", "K"], desc: "Code block" },
    ],
  },
  {
    title: "Lists & Blocks",
    shortcuts: [
      { keys: ["Ctrl", "Shift", "B"], desc: "Bullet list" },
      { keys: ["Ctrl", "Shift", "O"], desc: "Numbered list" },
      { keys: ["Ctrl", "Shift", "."], desc: "Blockquote" },
    ],
  },
  {
    title: "Media",
    shortcuts: [
      { keys: ["Ctrl", "Shift", "I"], desc: "Insert image" },
    ],
  },
];

export default function KeyboardShortcuts({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="shortcuts-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="shortcuts-modal">
        <div className="shortcuts-header">
          <div className="shortcuts-title-row">
            <Keyboard className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            <h2 className="shortcuts-title">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="btn-icon"><X className="w-5 h-5" /></button>
        </div>

        <div className="shortcuts-body">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} className="shortcuts-group">
              <h3 className="shortcuts-group-title">{group.title}</h3>
              <div className="shortcuts-list">
                {group.shortcuts.map((s, i) => (
                  <div key={i} className="shortcut-row">
                    <span className="shortcut-desc">{s.desc}</span>
                    <div className="shortcut-keys">
                      {s.keys.map((key, ki) => (
                        <span key={ki} className="flex items-center gap-1">
                          {ki > 0 && <span className="kbd-plus">+</span>}
                          <kbd className="kbd">{key}</kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="shortcuts-footer">
          Press <kbd className="kbd">Esc</kbd> or <kbd className="kbd">?</kbd> to close
        </div>
      </div>
    </div>
  );
}
