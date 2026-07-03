import { useState, useRef, useEffect, type ReactNode } from "react";
import clsx from "clsx";
import Button from "../Button";
import "./Popconfirm.css";

interface PopconfirmProps {
  title: ReactNode;
  children: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Popconfirm({
  title,
  children,
  onConfirm,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  className,
  style,
}: PopconfirmProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [open]);

  return (
    <div ref={ref} className={clsx("pixel-popconfirm", className)} style={style}>
      <div onClick={() => setOpen((v) => !v)}>{children}</div>
      {open && (
        <div className="pixel-popconfirm-card">
          <div className="pixel-popconfirm-title">{title}</div>
          <div className="pixel-popconfirm-actions">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onCancel?.();
                setOpen(false);
              }}
            >
              {cancelText}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                onConfirm?.();
                setOpen(false);
              }}
            >
              {okText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}