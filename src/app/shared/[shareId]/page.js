"use client";

import { useState, useEffect, use } from "react";
import { fetchNoteByShareId } from "@/lib/notes-service";
import ReactMarkdown from "react-markdown";
import {
  FileText,
  Tag,
  Clock,
  Sparkles,
  ListChecks,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function SharedNotePage({ params }) {
  const resolvedParams = use(params);
  const shareId = resolvedParams.shareId;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchNoteByShareId(shareId);
        if (!data) {
          setError(true);
        } else {
          setNote(data);
        }
      } catch (err) {
        console.error("Error loading shared note:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shareId]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)" }}
      >
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="text-center animate-fade-in">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(239, 68, 68, 0.1)" }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: "var(--color-danger)" }} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
            Note Not Found
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            This note doesn&apos;t exist or is no longer public.
          </p>
          <Link href="/" className="btn-primary no-underline">
            Go to Peblo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Minimal header */}
      <header
        className="border-b py-4"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-primary)" }}
            >
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold" style={{ color: "var(--color-text)" }}>
              Peblo Notes
            </span>
          </Link>
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: "rgba(13, 148, 136, 0.1)",
              color: "var(--color-primary)",
            }}
          >
            Shared Note
          </span>
        </div>
      </header>

      {/* Note content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <article className="animate-slide-up">
          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            {note.title || "Untitled Note"}
          </h1>

          {/* Meta */}
          <div
            className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              <Clock className="w-4 h-4" />
              {new Date(note.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span key={tag} className="tag text-xs">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="markdown-body" style={{ color: "var(--color-text)" }}>
            <ReactMarkdown>{note.content || ""}</ReactMarkdown>
          </div>

          {/* AI Summary */}
          {note.aiSummary && (
            <div
              className="mt-8 p-6 rounded-2xl border"
              style={{
                background: "rgba(13, 148, 136, 0.03)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" style={{ color: "var(--color-cta)" }} />
                <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                  AI Summary
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {note.aiSummary}
              </p>

              {note.aiActionItems?.length > 0 && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <ListChecks className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                    <h4 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      Action Items
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {note.aiActionItems.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <CheckCircle
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: "var(--color-primary)" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-6"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Shared via{" "}
            <Link
              href="/"
              className="font-semibold no-underline"
              style={{ color: "var(--color-primary)" }}
            >
              Peblo Notes
            </Link>{" "}
            — AI-Powered Notes Workspace
          </p>
        </div>
      </footer>
    </div>
  );
}
