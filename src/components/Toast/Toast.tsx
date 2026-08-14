import { type ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import "./Toast.css";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  duration?: number;
  variant?: "default" | "success" | "error" | "warning";
  action?: ReactNode;
}

export default function Toast({
  open,
  onClose,
  message,
  duration = 3000,
  variant = "default",
  action,
}: ToastProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setClosing(true), duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  useEffect(() => {
    if (closing) {
      const timer = setTimeout(onClose, 200);
      return () => clearTimeout(timer);
    }
  }, [closing, onClose]);

  if (!open) return null;

  return (
    <div
      className={clsx(
        "pixel-toast",
        `pixel-toast--${variant}`,
        closing && "pixel-toast--closing"
      )}
      onAnimationEnd={() => {
        if (closing) onClose();
      }}
    >
      <span className="pixel-toast-message">{message}</span>
      {action && <div className="pixel-toast-action">{action}</div>}
      <button
        className="pixel-toast-close"
        onClick={() => {
          if (!closing) setClosing(true);
        }}
      >
        ✕
      </button>
    </div>
  );
}
