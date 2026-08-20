import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import "./Drawer.css";
import { lockBodyScroll, unlockBodyScroll } from "../../utils/scrollLock";
import { useLocale, t } from "../LocaleProvider";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  placement?: "left" | "right";
  closable?: boolean;
  /** 点击遮罩是否关闭，默认 true */
  maskClosable?: boolean;
  /** 按 Esc 是否关闭，默认 true */
  keyboard?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  placement = "right",
  closable = true,
  maskClosable = true,
  keyboard = true,
  className,
  style,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<Element | null>(null);
  const { messages } = useLocale();

  // Escape 关闭 + body 滚动锁定（共享计数器）
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (keyboard && e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    lockBodyScroll();
    return () => {
      document.removeEventListener("keydown", handleEsc);
      unlockBodyScroll();
    };
  }, [open, onClose, keyboard]);

  // 焦点陷阱 + 打开聚焦 + 关闭还原焦点
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    prevActiveRef.current = document.activeElement;

    const focusables = () =>
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
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
    const t = window.setTimeout(() => focusables()[0]?.focus(), 0);
    return () => {
      panel.removeEventListener("keydown", handleKey);
      window.clearTimeout(t);
      const prev = prevActiveRef.current;
      if (prev && document.contains(prev) && prev instanceof HTMLElement) {
        prev.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  const drawer = (
    <div className="pixel-drawer-overlay" onClick={maskClosable ? onClose : undefined}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        className={clsx(
          "pixel-drawer",
          `pixel-drawer--${placement}`,
          className
        )}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || closable) && (
          <div className="pixel-drawer-header">
            {title && <span className="pixel-drawer-title">{title}</span>}
            {closable && (
              <button
                type="button"
                className="pixel-drawer-close"
                onClick={onClose}
                aria-label={t("close", messages)}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="pixel-drawer-body">{children}</div>
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
