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
      {/* Search input — flex wrapper prevents icon overlap */}
      <div className="search-wrapper">
        <div className="search-icon">
          <Search className="w-[18px] h-[18px]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          placeholder="Search notes…"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="search-clear"
            title="Clear search"
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
