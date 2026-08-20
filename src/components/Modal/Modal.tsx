import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import "./Modal.css";
import { lockBodyScroll, unlockBodyScroll } from "../../utils/scrollLock";
import { useLocale, t } from "../LocaleProvider";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  closable?: boolean;
  /** 点击遮罩是否关闭，默认 true */
  maskClosable?: boolean;
  /** 按 Esc 是否关闭，默认 true */
  keyboard?: boolean;
  footer?: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  closable = true,
  maskClosable = true,
  keyboard = true,
  footer,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<Element | null>(null);
  const { messages } = useLocale();

  // Escape 关闭 + body 滚动锁定（共享计数器）
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (keyboard && e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    lockBodyScroll();
    return () => {
      window.removeEventListener("keydown", handleKey);
      unlockBodyScroll();
    };
  }, [open, onClose, keyboard]);

  // 焦点陷阱：Tab 循环在弹层内 + 打开聚焦 + 关闭还原焦点
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    prevActiveRef.current = document.activeElement;

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
      // 关闭时把焦点还原到打开前的元素（WCAG 2.4.3 焦点顺序）
      const prev = prevActiveRef.current;
      if (prev && document.contains(prev) && prev instanceof HTMLElement) {
        prev.focus();
      }
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
                aria-label={t("close", messages)}
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
