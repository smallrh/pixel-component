import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./Select.css";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  style,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={clsx("pixel-select", className)} style={style}>
      <div className="pixel-select-trigger" onClick={() => setOpen((v) => !v)}>
        <span className={clsx(!selected && "pixel-select-placeholder")}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="pixel-select-arrow">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div className="pixel-select-dropdown">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={clsx(
                "pixel-select-option",
                opt.value === value && "pixel-select-option--selected"
              )}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}