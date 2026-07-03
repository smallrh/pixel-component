import { useEffect } from "react";
import clsx from "clsx";
import "./Drawer.css";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  placement?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  placement = "right",
  className,
  style,
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pixel-drawer-overlay" onClick={onClose}>
      <div
        className={clsx(
          "pixel-drawer",
          `pixel-drawer--${placement}`,
          className
        )}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="pixel-drawer-header">
            <span className="pixel-drawer-title">{title}</span>
            <button className="pixel-drawer-close" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div className="pixel-drawer-body">{children}</div>
      </div>
    </div>
  );
}