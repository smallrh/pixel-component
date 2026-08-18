import type { CSSProperties } from "react";
import clsx from "clsx";
import "./Pagination.css";

export interface PaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  showTotal?: boolean;
  className?: string;
  style?: CSSProperties;
  onChange?: (page: number) => void;
}

export default function Pagination({
  current,
  total,
  pageSize = 10,
  showTotal = false,
  className,
  style,
  onChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");
      for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={clsx("pixel-pagination", className)} style={style}>
      {showTotal && (
        <span className="pixel-pagination-total">
          Total {total} items
        </span>
      )}

      <button
        type="button"
        className="pixel-pagination-btn"
        disabled={current <= 1}
        onClick={() => onChange?.(current - 1)}
        aria-label="Previous page"
      >
        ◀
      </button>

      {pageNumbers.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="pixel-pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            type="button"
            key={page}
            className={clsx(
              "pixel-pagination-btn",
              page === current && "pixel-pagination-btn--active"
            )}
            onClick={() => onChange?.(page)}
            aria-current={page === current ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        className="pixel-pagination-btn"
        disabled={current >= totalPages}
        onClick={() => onChange?.(current + 1)}
        aria-label="Next page"
      >
        ▶
      </button>
    </div>
  );
}