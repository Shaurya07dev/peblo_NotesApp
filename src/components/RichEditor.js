"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { useEffect, useCallback, useState, useRef } from "react";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  Minus, Redo, Undo, Keyboard,
} from "lucide-react";

/* ── Image Insert Popover ── */
function ImagePopover({ onInsert, onClose }) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) { onInsert(url.trim(), alt.trim()); onClose(); }
  };
  return (
    <div className="image-popover" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        <div className="image-popover-field">
          <label>Image URL *</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/image.png" autoFocus />
        </div>
        <div className="image-popover-field">
          <label>Alt Text</label>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Description (optional)" />
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ fontSize: "0.875rem" }}>Cancel</button>
          <button type="submit" className="btn-primary" style={{ fontSize: "0.875rem", padding: "8px 16px" }} disabled={!url.trim()}>Insert</button>
        </div>
      </form>
    </div>
  );
}

/* ── Link Insert Popover ── */
function LinkPopover({ onInsert, onClose, initialUrl }) {
  const [url, setUrl] = useState(initialUrl || "");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) { onInsert(url.trim()); onClose(); }
  };
  return (
    <div className="image-popover" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        <div className="image-popover-field">
          <label>URL *</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" autoFocus />
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} className="btn-ghost" style={{ fontSize: "0.875rem" }}>Cancel</button>
          <button type="submit" className="btn-primary" style={{ fontSize: "0.875rem", padding: "8px 16px" }} disabled={!url.trim()}>Insert Link</button>
        </div>
      </form>
    </div>
  );
}

/* ── Toolbar ── */
function Toolbar({ editor, onShortcutsClick }) {
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [showLinkPopover, setShowLinkPopover] = useState(false);

  if (!editor) return null;

  const btn = (icon, title, action, isActive = false) => (
    <button
      key={title}
      className={`editor-toolbar-btn ${isActive ? "editor-toolbar-btn--active" : ""}`}
      title={title}
      onClick={action}
      type="button"
    >
      {icon}
    </button>
  );

  const divider = (key) => <div key={key} className="editor-toolbar-divider" />;

  return (
    <div className="editor-toolbar">
      {btn(<Undo className="w-4 h-4" />, "Undo (Ctrl+Z)", () => editor.chain().focus().undo().run())}
      {btn(<Redo className="w-4 h-4" />, "Redo (Ctrl+Y)", () => editor.chain().focus().redo().run())}
      {divider("d0")}
      {btn(<Bold className="w-4 h-4" />, "Bold (Ctrl+B)", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
      {btn(<Italic className="w-4 h-4" />, "Italic (Ctrl+I)", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
      {btn(<Strikethrough className="w-4 h-4" />, "Strikethrough (Ctrl+Shift+X)", () => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"))}
      {btn(<Code className="w-4 h-4" />, "Inline Code (Ctrl+E)", () => editor.chain().focus().toggleCode().run(), editor.isActive("code"))}
      {divider("d1")}
      {btn(<Heading1 className="w-4 h-4" />, "Heading 1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
      {btn(<Heading2 className="w-4 h-4" />, "Heading 2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
      {btn(<Heading3 className="w-4 h-4" />, "Heading 3", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
      {divider("d2")}
      {btn(<List className="w-4 h-4" />, "Bullet List", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
      {btn(<ListOrdered className="w-4 h-4" />, "Numbered List", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
      {btn(<Quote className="w-4 h-4" />, "Blockquote", () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
      {btn(<Minus className="w-4 h-4" />, "Horizontal Rule", () => editor.chain().focus().setHorizontalRule().run())}
      {divider("d3")}

      {/* Link button */}
      <div style={{ position: "relative" }}>
        {btn(
          <LinkIcon className="w-4 h-4" />,
          "Insert Link (Ctrl+K)",
          () => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setShowLinkPopover(true);
            }
          },
          editor.isActive("link")
        )}
        {showLinkPopover && (
          <LinkPopover
            initialUrl={editor.getAttributes("link").href}
            onInsert={(url) => editor.chain().focus().setLink({ href: url, target: "_blank" }).run()}
            onClose={() => setShowLinkPopover(false)}
          />
        )}
      </div>

      {/* Image button */}
      <div style={{ position: "relative" }}>
        {btn(<ImageIcon className="w-4 h-4" />, "Insert Image", () => setShowImagePopover(true))}
        {showImagePopover && (
          <ImagePopover
            onInsert={(url, alt) => editor.chain().focus().setImage({ src: url, alt: alt || "image" }).run()}
            onClose={() => setShowImagePopover(false)}
          />
        )}
      </div>

      <div className="editor-toolbar-spacer" />

      {btn(<Keyboard className="w-4 h-4" />, "Keyboard Shortcuts (?)", onShortcutsClick)}
    </div>
  );
}

/* ── Main Rich Editor ── */
export default function RichEditor({ content, onUpdate, onShortcutsClick }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing your note…",
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "rich-editor-content",
      },
    },
    onUpdate: ({ editor }) => {
      const md = editor.storage.markdown.getMarkdown();
      onUpdate(md);
    },
  });

  // Sync external content changes (e.g., initial load)
  useEffect(() => {
    if (editor && content !== undefined && !editor.isFocused) {
      const currentMd = editor.storage.markdown?.getMarkdown() || "";
      if (currentMd !== content) {
        editor.commands.setContent(content || "");
      }
    }
  }, [content, editor]);

  return (
    <div className="rich-editor-wrapper">
      <Toolbar editor={editor} onShortcutsClick={onShortcutsClick} />
      <EditorContent editor={editor} className="rich-editor-container" />
    </div>
  );
}
