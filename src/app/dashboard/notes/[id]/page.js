"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchNote, updateNote, deleteNoteById } from "@/lib/notes-service";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import {
  ArrowLeft, Trash2, Sparkles, Globe, GlobeLock, Tag, X,
  Loader2, CheckCircle, Copy, ListChecks, Lightbulb,
  AlertCircle, Clock,
} from "lucide-react";

const RichEditor = dynamic(() => import("@/components/RichEditor"), { ssr: false });

export default function NoteEditorPage({ params }) {
  return (
    <ProtectedRoute>
      <NoteEditorContent params={params} />
    </ProtectedRoute>
  );
}

function NoteEditorContent({ params }) {
  const resolvedParams = use(params);
  const noteId = resolvedParams.id;
  const { user } = useAuth();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchNote(noteId);
        if (!data || data.userId !== user?.uid) { router.replace("/dashboard"); return; }
        setNote(data);
      } catch (error) { console.error("Error loading note:", error); router.replace("/dashboard"); }
      finally { setLoading(false); }
    }
    if (user?.uid) load();
  }, [noteId, user?.uid, router]);

  const debouncedSave = useCallback((updates) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true);
      try { await updateNote(noteId, updates); setLastSaved(new Date()); }
      catch (error) { console.error("Auto-save error:", error); }
      finally { setSaving(false); }
    }, 800);
  }, [noteId]);

  useEffect(() => () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); }, []);

  // Global shortcuts (Ctrl+S, ?)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const tag = e.target.tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA";

      if (e.key === "?" && !inInput && !e.target.closest(".ProseMirror")) {
        e.preventDefault(); setShowShortcuts((v) => !v); return;
      }
      if (ctrl && e.key === "s") {
        e.preventDefault();
        if (note) debouncedSave({ title: note.title, content: note.content, tags: note.tags });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [note, debouncedSave]);

  const handleTitleChange = (e) => { const title = e.target.value; setNote((prev) => ({ ...prev, title })); debouncedSave({ title }); };

  const handleContentUpdate = useCallback((markdown) => {
    setNote((prev) => {
      if (!prev || prev.content === markdown) return prev;
      return { ...prev, content: markdown };
    });
    debouncedSave({ content: markdown });
  }, [debouncedSave]);

  const handleAddTag = (e) => { e.preventDefault(); const tag = newTag.trim().toLowerCase(); if (!tag || note.tags.includes(tag)) { setNewTag(""); return; } const tags = [...note.tags, tag]; setNote((prev) => ({ ...prev, tags })); setNewTag(""); debouncedSave({ tags }); };
  const handleRemoveTag = (tagToRemove) => { const tags = note.tags.filter((t) => t !== tagToRemove); setNote((prev) => ({ ...prev, tags })); debouncedSave({ tags }); };

  const handleToggleShare = async () => {
    const isPublic = !note.isPublic;
    setNote((prev) => ({ ...prev, isPublic }));
    await updateNote(noteId, { isPublic });
    if (isPublic) { setShowShareToast(true); setTimeout(() => setShowShareToast(false), 3000); }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/shared/${note.shareId}`);
    setShowShareToast(true); setTimeout(() => setShowShareToast(false), 2000);
  };

  const handleGenerateAI = async () => {
    if (aiLoading) return;
    if (!note.content || note.content.trim().length < 10) { setAiError("Write at least 10 characters before generating a summary."); return; }
    setAiLoading(true); setAiError("");
    try {
      const res = await fetch(`/api/notes/${noteId}/generate-summary`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: note.content, title: note.title }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const aiUpdates = { aiSummary: data.summary, aiActionItems: data.action_items, aiSuggestedTitle: data.suggested_title };
      setNote((prev) => ({ ...prev, ...aiUpdates }));
      await updateNote(noteId, aiUpdates);
    } catch (error) { setAiError(error.message || "Failed to generate AI summary."); }
    finally { setAiLoading(false); }
  };

  const handleApplySuggestedTitle = () => { if (note.aiSuggestedTitle) { setNote((prev) => ({ ...prev, title: prev.aiSuggestedTitle })); debouncedSave({ title: note.aiSuggestedTitle }); } };
  const handleDelete = async () => { setDeleting(true); try { await deleteNoteById(noteId); router.push("/dashboard"); } catch (error) { console.error("Error deleting note:", error); setDeleting(false); } };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/dashboard")} className="btn-ghost">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-light)" }}>
              {saving ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>) : lastSaved ? (<><CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--color-success)" }} /> Saved</>) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleToggleShare} className="btn-ghost text-sm" style={{ color: note.isPublic ? "var(--color-success)" : undefined }}>
              {note.isPublic ? <Globe className="w-4 h-4" /> : <GlobeLock className="w-4 h-4" />}
              {note.isPublic ? "Public" : "Private"}
            </button>
            {note.isPublic && (
              <button onClick={handleCopyShareLink} className="btn-ghost text-sm"><Copy className="w-4 h-4" /> Copy Link</button>
            )}
            <button onClick={handleGenerateAI} className="btn-primary text-sm py-2 px-4" disabled={aiLoading}>
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI Summary
            </button>
            <button onClick={() => setDeleteModalOpen(true)} className="btn-icon" style={{ color: "var(--color-danger)" }} title="Delete note">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {aiError && (
          <div className="flex items-center gap-2 p-3 rounded-lg text-sm mb-4 animate-slide-up" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)" }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {aiError}
            <button onClick={() => setAiError("")} className="ml-auto btn-icon p-1"><X className="w-3 h-3" /></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Editor Column */}
          <div className="lg:col-span-3">
            <input
              type="text" value={note.title} onChange={handleTitleChange}
              placeholder="Note title…"
              className="w-full font-bold bg-transparent border-none outline-none mb-4"
              style={{ color: "var(--color-text)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            />

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {note.tags.map((tag) => (
                <span key={tag} className="tag">
                  <Tag className="w-3 h-3" /> {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-0.5 hover:opacity-70"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <form onSubmit={handleAddTag} className="inline-flex">
                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="+ Add tag"
                  className="text-sm bg-transparent border-none outline-none w-24" style={{ color: "var(--color-text-muted)" }} />
              </form>
            </div>

            {/* WYSIWYG Rich Editor */}
            <RichEditor
              content={note.content}
              onUpdate={handleContentUpdate}
              onShortcutsClick={() => setShowShortcuts(true)}
            />

            <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: "var(--color-text-light)" }}>
              <Clock className="w-3.5 h-3.5" />
              Last updated:{" "}
              {new Date(note.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>

          {/* AI Sidebar */}
          <aside className="space-y-4">
            {note.aiSummary && (
              <div className="card p-5 animate-slide-up">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: "var(--color-cta)" }} />
                  <h4 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>AI Summary</h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{note.aiSummary}</p>
              </div>
            )}
            {note.aiSuggestedTitle && (
              <div className="card p-5 animate-slide-up">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4" style={{ color: "var(--color-warning)" }} />
                  <h4 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Suggested Title</h4>
                </div>
                <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>&quot;{note.aiSuggestedTitle}&quot;</p>
                <button onClick={handleApplySuggestedTitle} className="btn-ghost text-sm"><CheckCircle className="w-3.5 h-3.5" /> Apply Title</button>
              </div>
            )}
            {note.aiActionItems?.length > 0 && (
              <div className="card p-5 animate-slide-up">
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                  <h4 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Action Items</h4>
                </div>
                <ul className="space-y-2">
                  {note.aiActionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--color-primary)" }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!note.aiSummary && !aiLoading && (
              <div className="card p-5 text-center" style={{ borderStyle: "dashed" }}>
                <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-text-light)" }} />
                <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>AI Insights</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Click &quot;AI Summary&quot; to generate a summary, action items, and title suggestion.</p>
              </div>
            )}
            {aiLoading && (
              <div className="card p-5 text-center animate-pulse">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" style={{ color: "var(--color-cta)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Analyzing with AI…</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>This may take a few seconds</p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-up" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <CheckCircle className="w-4 h-4" style={{ color: "var(--color-success)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Share link copied!</span>
        </div>
      )}

      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Note">
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          Are you sure you want to delete <strong style={{ color: "var(--color-text)" }}>&quot;{note.title || "Untitled Note"}&quot;</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteModalOpen(false)} className="btn-ghost">Cancel</button>
          <button onClick={handleDelete} className="btn-primary" style={{ background: "var(--color-danger)" }} disabled={deleting}>
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
