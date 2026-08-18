import { type CSSProperties, type KeyboardEvent, useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import "./Select.css";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
  style,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const openDropdown = useCallback(() => {
    const idx = options.findIndex((o) => o.value === value);
    setHighlighted(idx >= 0 ? idx : 0);
    setOpen(true);
  }, [options, value]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          openDropdown();
        } else {
          setHighlighted((h) => (h + 1) % options.length);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setHighlighted((h) => (h - 1 + options.length) % options.length);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (open && options[highlighted]) {
          onChange?.(options[highlighted].value);
          close();
        } else if (!open) {
          openDropdown();
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setHighlighted(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setHighlighted(options.length - 1);
        }
        break;
    }
  };

  const selected = options.find((o) => o.value === value);

  return (
    <div
      ref={ref}
      className={clsx("pixel-select", disabled && "pixel-select--disabled", className)}
      style={style}
    >
      <div
        ref={triggerRef}
        className="pixel-select-trigger"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && (open ? close() : openDropdown())}
        onKeyDown={handleKeyDown}
      >
        <span className={clsx(!selected && "pixel-select-placeholder")}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="pixel-select-arrow">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div className="pixel-select-dropdown" role="listbox">
          {options.map((opt, i) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={clsx(
                "pixel-select-option",
                opt.value === value && "pixel-select-option--selected",
                i === highlighted && "pixel-select-option--highlighted"
              )}
              onMouseEnter={() => setHighlighted(i)}
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
