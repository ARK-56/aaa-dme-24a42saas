"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

const ROWS_PER_PAGE = 10;
/** Page buttons shown either side of the current page before an ellipsis. */
const PAGE_WINDOW = 3;

interface Props<T> {
  rows: T[];
  columns: { label: string; className?: string }[];
  /** Case-insensitive match against the search box. */
  filterFn: (row: T, query: string) => boolean;
  /** `index` is the 1-based position across the whole filtered set. */
  renderRow: (row: T, index: number) => ReactNode;
  rowKey: (row: T, index: number) => string;
  searchPlaceholder: string;
  emptyMessage: string;
}

/**
 * Searchable, paginated table shared by all five admin sections — the React
 * equivalent of the theme's createTableManager().
 */
export default function AdminTable<T>({
  rows,
  columns,
  filterFn,
  renderRow,
  rowKey,
  searchPlaceholder,
  emptyMessage,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter((row) => filterFn(row, q)) : rows;
  }, [rows, query, filterFn]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [query, rows]);

  const start = (page - 1) * ROWS_PER_PAGE;
  const visible = filtered.slice(start, start + ROWS_PER_PAGE);

  return (
    <>
      <div className="admin-table-controls">
        <div className="admin-search-wrap">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="admin-search-input"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.label} className={col.className}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="table-empty-row">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr key={rowKey(row, start + i)}>{renderRow(row, start + i + 1)}</tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            type="button"
            className="pag-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous page"
          >
            &lsaquo;
          </button>

          {/* First, last, and a window of three either side of the current page. */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
            const inWindow =
              num === 1 ||
              num === totalPages ||
              (num >= page - PAGE_WINDOW && num <= page + PAGE_WINDOW);
            if (inWindow) {
              return (
                <button
                  key={num}
                  type="button"
                  className={`pag-btn${num === page ? " active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              );
            }
            if (num === page - PAGE_WINDOW - 1 || num === page + PAGE_WINDOW + 1) {
              return (
                <span className="pag-info" key={`ellipsis-${num}`}>
                  …
                </span>
              );
            }
            return null;
          })}

          <button
            type="button"
            className="pag-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next page"
          >
            &rsaquo;
          </button>
          <span className="pag-info">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </>
  );
}
