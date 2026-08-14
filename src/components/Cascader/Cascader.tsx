import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./Cascader.css";

interface CascaderOption {
  label: string;
  value: string;
  children?: CascaderOption[];
}

interface CascaderProps {
  options: CascaderOption[];
  value?: string[];
  onChange?: (value: string[], labels: string[]) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Cascader({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  className,
  style,
}: CascaderProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const [hovered, setHovered] = useState<string[]>([]);

  return (
    <div ref={ref} className={clsx("pixel-cascader", className)} style={style}>
      <div className="pixel-cascader-trigger" onClick={() => setOpen((v) => !v)}>
        <span className={clsx(value.length === 0 && "pixel-cascader-placeholder")}>
          {value.length > 0 ? value.join(" / ") : placeholder}
        </span>
        <span className="pixel-cascader-arrow">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div className="pixel-cascader-dropdown">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={clsx(
                "pixel-cascader-option",
                hovered.includes(opt.value) && "pixel-cascader-option--hover"
              )}
              onMouseEnter={() => setHovered([opt.value])}
              onClick={() => {
                onChange?.([opt.value], [opt.label]);
                setOpen(false);
                setHovered([]);
              }}
            >
              <span>{opt.label}</span>
              {opt.children && <span>›</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}