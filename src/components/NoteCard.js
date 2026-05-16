"use client";

import { useRouter } from "next/navigation";
import { FileText, Clock, Tag, Sparkles, Globe, Archive } from "lucide-react";

/**
 * Card component for note preview in the dashboard grid.
 */
export default function NoteCard({ note }) {
  const router = useRouter();

  const displayTitle = note.title || "Untitled Note";
  const preview = (note.content || "").slice(0, 120);
  const updatedAt = note.updatedAt
    ? new Date(note.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="card p-5 cursor-pointer flex flex-col gap-3"
      onClick={() => router.push(`/dashboard/notes/${note.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/dashboard/notes/${note.id}`);
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-base font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--color-text)" }}
        >
          {displayTitle}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          {note.aiSummary && (
            <Sparkles
              className="w-4 h-4"
              style={{ color: "var(--color-cta)" }}
              title="AI summarized"
            />
          )}
          {note.isPublic && (
            <Globe
              className="w-4 h-4"
              style={{ color: "var(--color-success)" }}
              title="Public"
            />
          )}
          {note.isArchived && (
            <Archive
              className="w-4 h-4"
              style={{ color: "var(--color-text-light)" }}
              title="Archived"
            />
          )}
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          {preview}
          {note.content?.length > 120 ? "…" : ""}
        </p>
      )}

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag text-xs">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span
              className="text-xs py-1 px-2"
              style={{ color: "var(--color-text-light)" }}
            >
              +{note.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center gap-1.5 mt-auto pt-2 border-t text-xs"
        style={{
          borderColor: "var(--color-border-light)",
          color: "var(--color-text-light)",
        }}
      >
        <Clock className="w-3.5 h-3.5" />
        {updatedAt}
      </div>
    </div>
  );
}
