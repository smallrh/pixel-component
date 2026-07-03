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
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
      const timer = setTimeout(() => {
        setClosing(true);
        setTimeout(onClose, 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open && !visible) return null;

  return (
    <div
      className={clsx(
        "pixel-toast",
        `pixel-toast--${variant}`,
        closing && "pixel-toast--closing"
      )}
      onAnimationEnd={() => {
        if (closing) setVisible(false);
      }}
    >
      <span className="pixel-toast-message">{message}</span>
      {action && <div className="pixel-toast-action">{action}</div>}
      <button className="pixel-toast-close" onClick={() => { setClosing(true); setTimeout(onClose, 200); }}>
        ✕
      </button>
    </div>
  );
}