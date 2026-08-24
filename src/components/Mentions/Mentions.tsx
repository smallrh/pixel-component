import { type ChangeEvent, type CSSProperties, type KeyboardEvent, useId, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./Mentions.css";

export interface MentionsProps {
  /** 可 @ 提及的候选项列表 */
  options: { label: string; value: string }[];
  /** 受控：当前文本内容 */
  value?: string;
  /** 文本变化回调 */
  onChange?: (value: string) => void;
  /** 占位提示文本，默认 "@mention" */
  placeholder?: string;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Mentions 提及。在文本域中输入 "@" 触发候选项下拉，选中后回填为 "@value " 形式。
 * 关键特性：输入 "@" 后未出现空格即弹出过滤列表；外部 value 变化时自动同步内部文本；
 * 键盘箭头键高亮、Enter 选中、Esc 关闭。
 */
export default function Mentions({
  options,
  value = "",
  onChange,
  placeholder = "@mention",
  open,
  onOpenChange,
  className,
  style,
}: MentionsProps) {
  const [text, setText] = useState(value);
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = isControlled ? open : internalOpen;
  const emitOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const [filter, setFilter] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listboxId = `pixel-mentions${uid}-listbox`;
  const optionId = (i: number) => `pixel-mentions${uid}-option-${i}`;

  // 外部受控 value 变化时同步内部 text（渲染期间调整，React 官方推荐模式）
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setText(value);
  }

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) emitOpenChange(false);
    };
    if (currentOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [currentOpen]);

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
        setHighlighted(0);
        emitOpenChange(true);
        return;
      }
    }
    emitOpenChange(false);
  };

  const select = (opt: { label: string; value: string }) => {
    const lastAt = text.lastIndexOf("@");
    const newText = text.slice(0, lastAt) + `@${opt.value} `;
    setText(newText);
    onChange?.(newText);
    emitOpenChange(false);
  };

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(filter.toLowerCase())
  );

  const safeHighlight = filtered.length === 0 ? 0 : Math.min(highlighted, filtered.length - 1);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!currentOpen) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (filtered.length > 0) {
          setHighlighted((h) => (h + 1) % filtered.length);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (filtered.length > 0) {
          setHighlighted((h) => (h - 1 + filtered.length) % filtered.length);
        }
        break;
      case "Enter":
        if (filtered[safeHighlight]) {
          e.preventDefault();
          select(filtered[safeHighlight]);
        }
        break;
      case "Escape":
        e.preventDefault();
        emitOpenChange(false);
        break;
    }
  };

  return (
    <div ref={ref} className={clsx("pixel-mentions", className)} style={style}>
      <textarea
        className="pixel-mentions-textarea"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={currentOpen && filtered.length > 0}
        aria-controls={currentOpen && filtered.length > 0 ? listboxId : undefined}
        aria-activedescendant={currentOpen && filtered[safeHighlight] ? optionId(safeHighlight) : undefined}
        aria-autocomplete="list"
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
      />
      {currentOpen && filtered.length > 0 && (
        <div id={listboxId} className="pixel-mentions-dropdown" role="listbox">
          {filtered.map((opt, i) => (
            <div
              key={opt.value}
              id={optionId(i)}
              role="option"
              aria-selected={false}
              className={clsx(
                "pixel-mentions-option",
                i === safeHighlight && "pixel-mentions-option--highlighted"
              )}
              onMouseEnter={() => setHighlighted(i)}
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
