import { memo, useCallback, useState, type CSSProperties, type KeyboardEvent } from "react";
import clsx from "clsx";
import "./Pagination.css";

export interface PaginationProps {
  /** 受控：当前页码（从 1 开始） */
  current?: number;
  /** 非受控：初始页码（从 1 开始），默认 1 */
  defaultCurrent?: number;
  /** 数据总条数 */
  total: number;
  /** 每页条数，默认 10 */
  pageSize?: number;
  /** 是否展示总条数文本，默认 false */
  showTotal?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 页码变化回调，参数为目标页码 */
  onChange?: (page: number) => void;
}

interface PageButtonProps {
  page: number;
  active: boolean;
  onClick: (page: number) => void;
}

/**
 * 单个页码按钮。用 memo 包裹，避免父组件 re-render 时全量重渲染。
 * props 均为基本类型 + 稳定回调引用，默认浅比较即可使未变更的页码按钮跳过重渲染
 * （current 变化时仅前后两个按钮的 active 状态改变）。
 */
const PageButton = memo(function PageButton({
  page,
  active,
  onClick,
}: PageButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "pixel-pagination-btn",
        active && "pixel-pagination-btn--active"
      )}
      onClick={() => onClick(page)}
      aria-current={active ? "page" : undefined}
    >
      {page}
    </button>
  );
});

/**
 * Pagination 分页。支持受控（current）与非受控（defaultCurrent）两种模式，
 * 页码超过 7 时自动折叠中间页码；首末页常驻；前后翻页按钮在边界禁用。
 */
export default function Pagination({
  current,
  defaultCurrent = 1,
  total,
  pageSize = 10,
  showTotal = false,
  className,
  style,
  size = "md",
  onChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // 受控/非受控
  const isControlled = current !== undefined;
  const [internalPage, setInternalPage] = useState(Math.min(defaultCurrent, totalPages));
  const currentPage = isControlled ? current : internalPage;

  const emitPageChange = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    if (!isControlled) setInternalPage(clamped);
    onChange?.(clamped);
  };

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // useCallback 稳定引用：传给 memo(PageButton)，避免每次 render 新函数导致 memo 失效
  const handlePageChange = useCallback(
    (page: number) => emitPageChange(page),
    // 不列入依赖：emitPageChange 内部依赖 isControlled/onChange，
    // 但 onChange 引用稳定，isControlled 在生命周期中不变
    []
  );

  return (
    <div
      className={clsx("pixel-pagination", `pixel-pagination--${size}`, className)}
      style={style}
      role="navigation"
      aria-label="pagination"
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Home") {
          e.preventDefault();
          if (currentPage !== 1) emitPageChange(1);
        } else if (e.key === "End") {
          e.preventDefault();
          if (currentPage !== totalPages) emitPageChange(totalPages);
        }
      }}
    >
      {showTotal && (
        <span className="pixel-pagination-total">
          Total {total} items
        </span>
      )}

      <button
        type="button"
        className="pixel-pagination-btn"
        disabled={currentPage <= 1}
        onClick={() => emitPageChange(currentPage - 1)}
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
          <PageButton
            key={page}
            page={page}
            active={page === currentPage}
            onClick={handlePageChange}
          />
        )
      )}

      <button
        type="button"
        className="pixel-pagination-btn"
        disabled={currentPage >= totalPages}
        onClick={() => emitPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        ▶
      </button>
    </div>
  );
}