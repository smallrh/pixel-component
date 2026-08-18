import { type CSSProperties, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./ColorPicker.css";

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLORS = [
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
  "#ffff00", "#ff00ff", "#00ffff", "#c0c0c0", "#808080",
  "#800000", "#808000", "#008000", "#800080", "#008080",
  "#000080",
];

export default function ColorPicker({
  value = "#000000",
  onChange,
  className,
  style,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className={clsx("pixel-colorpicker", className)} style={style}>
      <div
        className="pixel-colorpicker-swatch"
        style={{ background: value }}
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div className="pixel-colorpicker-popup">
          {DEFAULT_COLORS.map((c) => (
            <div
              key={c}
              className={clsx(
                "pixel-colorpicker-color",
                c === value && "pixel-colorpicker-color--selected"
              )}
              style={{ background: c }}
              onClick={() => {
                onChange?.(c);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}