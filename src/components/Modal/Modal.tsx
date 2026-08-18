import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import "./Modal.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
}

/** 统计当前打开的弹层数量，用于 body 滚动锁定 */
let openOverlays = 0;

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  closable = true,
  maskClosable = true,
  footer,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape 关闭 + body 滚动锁定
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    openOverlays += 1;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      openOverlays = Math.max(0, openOverlays - 1);
      if (openOverlays === 0) document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // 焦点陷阱：Tab 循环在弹层内
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const focusables = () =>
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
    const first = () => focusables()[0];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    panel.addEventListener("keydown", handleKey);
    // 聚焦到第一个可聚焦元素
    const t = window.setTimeout(() => first()?.focus(), 0);
    return () => {
      panel.removeEventListener("keydown", handleKey);
      window.clearTimeout(t);
    };
  }, [open]);

  if (!open) return null;

  const modal = (
    <div className="pixel-modal-overlay" onClick={maskClosable ? onClose : undefined}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        className={clsx("pixel-modal", `pixel-modal--${size}`)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="pixel-modal-header">
            <span className="pixel-modal-title">{title}</span>
            {closable && (
              <button
                type="button"
                className="pixel-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="pixel-modal-body">{children}</div>
        {footer !== undefined && <div className="pixel-modal-footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
