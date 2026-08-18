import { type ChangeEvent, type CSSProperties, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./Mentions.css";

export interface MentionsProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Mentions({
  options,
  value = "",
  onChange,
  placeholder = "@mention",
  className,
  style,
}: MentionsProps) {
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // 外部受控 value 变化时同步内部 text（渲染期间调整，React 官方推荐模式）
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setText(value);
  }

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    onChange?.(val);

    // Detect @ trigger
    const lastAt = val.lastIndexOf("@");
    if (lastAt !== -1) {
      const afterAt = val.slice(lastAt + 1);
      if (!afterAt.includes(" ")) {
        setFilter(afterAt);
        setOpen(true);
        return;
      }
    }
    setOpen(false);
  };

  const select = (opt: { label: string; value: string }) => {
    const lastAt = text.lastIndexOf("@");
    const newText = text.slice(0, lastAt) + `@${opt.value} `;
    setText(newText);
    onChange?.(newText);
    setOpen(false);
  };

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div ref={ref} className={clsx("pixel-mentions", className)} style={style}>
      <textarea
        className="pixel-mentions-textarea"
        value={text}
        onChange={handleInput}
        placeholder={placeholder}
        rows={3}
      />
      {open && filtered.length > 0 && (
        <div className="pixel-mentions-dropdown">
          {filtered.map((opt) => (
            <div
              key={opt.value}
              className="pixel-mentions-option"
              onClick={() => select(opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}