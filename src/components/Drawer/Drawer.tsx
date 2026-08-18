import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import "./Drawer.css";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  placement?: "left" | "right";
  closable?: boolean;
  maskClosable?: boolean;
  className?: string;
  style?: CSSProperties;
}

let openDrawers = 0;

export default function Drawer({
  open,
  onClose,
  title,
  children,
  placement = "right",
  closable = true,
  maskClosable = true,
  className,
  style,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape 关闭 + body 滚动锁定
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    openDrawers += 1;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      openDrawers = Math.max(0, openDrawers - 1);
      if (openDrawers === 0) document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // 焦点陷阱
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
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
                aria-label="Close"
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
