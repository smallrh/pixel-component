import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./AutoComplete.css";

interface AutoCompleteProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AutoComplete({
  options,
  value = "",
  onChange,
  placeholder = "Search...",
  className,
  style,
}: AutoCompleteProps) {
  const [input, setInput] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div ref={ref} className={clsx("pixel-autocomplete", className)} style={style}>
      <input
        className="pixel-autocomplete-input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
          onChange?.(e.target.value);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
      />
      {open && filtered.length > 0 && (
        <div className="pixel-autocomplete-dropdown">
          {filtered.map((opt) => (
            <div
              key={opt}
              className="pixel-autocomplete-option"
              onClick={() => {
                setInput(opt);
                onChange?.(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}