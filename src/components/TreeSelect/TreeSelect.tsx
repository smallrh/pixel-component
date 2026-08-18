import { type CSSProperties, type KeyboardEvent, useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import "./TreeSelect.css";

export interface TreeSelectNode {
  title: string;
  value: string;
  children?: TreeSelectNode[];
}

export interface TreeSelectProps {
  treeData: TreeSelectNode[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
}

interface FlatNode {
  title: string;
  value: string;
  level: number;
}

function flattenTree(nodes: TreeSelectNode[], level = 0): FlatNode[] {
  const result: FlatNode[] = [];
  nodes.forEach((n) => {
    result.push({ title: n.title, value: n.value, level });
    if (n.children) result.push(...flattenTree(n.children, level + 1));
  });
  return result;
}

export default function TreeSelect({
  treeData,
  value,
  onChange,
  placeholder = "Select...",
  className,
  style,
}: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const flat = flattenTree(treeData);
  const selected = flat.find((f) => f.value === value);

  const openDropdown = useCallback(() => {
    const idx = flat.findIndex((f) => f.value === value);
    setHighlighted(idx >= 0 ? idx : 0);
    setOpen(true);
  }, [flat, value]);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openDropdown();
        else setHighlighted((h) => (h + 1) % flat.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) setHighlighted((h) => (h - 1 + flat.length) % flat.length);
        break;
      case "Enter":
        e.preventDefault();
        if (open && flat[highlighted]) {
          onChange?.(flat[highlighted].value);
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
    }
  };

  return (
    <div ref={ref} className={clsx("pixel-treeselect", className)} style={style}>
      <div
        className="pixel-treeselect-trigger"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => (open ? close() : openDropdown())}
        onKeyDown={handleKeyDown}
      >
        <span className={clsx(!selected && "pixel-treeselect-placeholder")}>
          {selected?.title ?? placeholder}
        </span>
        <span className="pixel-treeselect-arrow">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div className="pixel-treeselect-dropdown" role="listbox">
          {flat.map((opt, i) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={clsx(
                "pixel-treeselect-option",
                opt.value === value && "pixel-treeselect-option--selected",
                i === highlighted && "pixel-treeselect-option--highlighted"
              )}
              style={{ paddingLeft: 10 + opt.level * 16 }}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
            >
              {opt.level > 0 && <span className="pixel-treeselect-indent">└ </span>}
              {opt.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}