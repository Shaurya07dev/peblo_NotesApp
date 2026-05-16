"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchNotes, createNote, deleteNoteById, fetchUserTags } from "@/lib/notes-service";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import SearchBar from "@/components/SearchBar";
import Modal from "@/components/Modal";
import {
  Plus,
  FileText,
  BarChart3,
  Loader2,
  Trash2,
  FolderOpen,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, noteId: null, noteTitle: "" });
  const [deleting, setDeleting] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const data = await fetchNotes(user.uid, { searchQuery, filterTag });
      setNotes(data);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, searchQuery, filterTag]);

  const loadTags = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const tags = await fetchUserTags(user.uid);
      setAvailableTags(tags);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleCreateNote = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const note = await createNote(user.uid);
      router.push(`/dashboard/notes/${note.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
      setCreating(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteModal.noteId) return;
    setDeleting(true);
    try {
      await deleteNoteById(deleteModal.noteId);
      setNotes((prev) => prev.filter((n) => n.id !== deleteModal.noteId));
      setDeleteModal({ open: false, noteId: null, noteTitle: "" });
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setDeleting(false);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              {greeting()},{" "}
              <span style={{ color: "var(--color-primary)" }}>
                {user?.displayName?.split(" ")[0] || "there"}
              </span>
              ! 👋
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              {notes.length > 0
                ? `You have ${notes.length} note${notes.length !== 1 ? "s" : ""}`
                : "Start by creating your first note"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/insights")}
              className="btn-ghost"
            >
              <BarChart3 className="w-4 h-4" />
              Insights
            </button>
            <button
              onClick={handleCreateNote}
              className="btn-primary"
              disabled={creating}
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              New Note
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterTag={filterTag}
            onFilterTagChange={setFilterTag}
            availableTags={availableTags}
          />
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "var(--color-primary)" }}
            />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(13, 148, 136, 0.1)" }}
            >
              {searchQuery || filterTag ? (
                <FolderOpen
                  className="w-10 h-10"
                  style={{ color: "var(--color-primary)" }}
                />
              ) : (
                <FileText
                  className="w-10 h-10"
                  style={{ color: "var(--color-primary)" }}
                />
              )}
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              {searchQuery || filterTag
                ? "No notes match your search"
                : "No notes yet"}
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-text-muted)" }}
            >
              {searchQuery || filterTag
                ? "Try adjusting your search or filters"
                : "Create your first note to get started"}
            </p>
            {!searchQuery && !filterTag && (
              <button
                onClick={handleCreateNote}
                className="btn-primary"
                disabled={creating}
              >
                <Plus className="w-4 h-4" />
                Create First Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div key={note.id} className="relative group">
                <NoteCard note={note} />
                {/* Delete button on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal({
                      open: true,
                      noteId: note.id,
                      noteTitle: note.title || "Untitled Note",
                    });
                  }}
                  className="absolute top-3 right-3 btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--color-danger)" }}
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, noteId: null, noteTitle: "" })}
        title="Delete Note"
      >
        <p
          className="text-sm mb-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--color-text)" }}>
            &quot;{deleteModal.noteTitle}&quot;
          </strong>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() =>
              setDeleteModal({ open: false, noteId: null, noteTitle: "" })
            }
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteNote}
            className="btn-primary"
            style={{ background: "var(--color-danger)" }}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
