"use client";

import { Search, X, Tag } from "lucide-react";

/**
 * Search bar with tag filter chips.
 */
export default function SearchBar({
  searchQuery,
  onSearchChange,
  filterTag,
  onFilterTagChange,
  availableTags = [],
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: "var(--color-text-light)" }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input pl-11 pr-10"
          placeholder="Search notes…"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tag chips */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterTagChange("")}
            className={`tag ${!filterTag ? "tag-active" : ""}`}
          >
            All
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onFilterTagChange(filterTag === tag ? "" : tag)}
              className={`tag ${filterTag === tag ? "tag-active" : ""}`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
