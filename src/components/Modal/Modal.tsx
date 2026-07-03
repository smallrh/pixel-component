import { type ReactNode, useEffect } from "react";
import clsx from "clsx";
import "./Modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (open) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pixel-modal-overlay" onClick={onClose}>
      <div
        className={clsx("pixel-modal", `pixel-modal--${size}`)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="pixel-modal-header">
            <span className="pixel-modal-title">{title}</span>
            <button className="pixel-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div className="pixel-modal-body">{children}</div>
      </div>
    </div>
  );
}