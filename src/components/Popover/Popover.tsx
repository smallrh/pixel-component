import { useState, useRef, useEffect, type ReactNode } from "react";
import clsx from "clsx";
import "./Popover.css";

interface PopoverProps {
  title?: ReactNode;
  content: ReactNode;
  children: ReactNode;
  trigger?: "click" | "hover";
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export default function Popover({
  title,
  content,
  children,
  trigger = "click",
  placement = "bottom",
  className,
  style,
}: PopoverProps) {
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
    <div
      ref={ref}
      className={clsx("pixel-popover", className)}
      style={style}
      onMouseEnter={trigger === "hover" ? () => setOpen(true) : undefined}
      onMouseLeave={trigger === "hover" ? () => setOpen(false) : undefined}
    >
      <div
        onClick={trigger === "click" ? () => setOpen((v) => !v) : undefined}
      >
        {children}
      </div>
      {open && (
        <div
          className={clsx(
            "pixel-popover-card",
            `pixel-popover--${placement}`
          )}
        >
          {title && <div className="pixel-popover-title">{title}</div>}
          <div className="pixel-popover-content">{content}</div>
        </div>
      )}
    </div>
  );
}