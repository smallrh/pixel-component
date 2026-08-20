import { type CSSProperties, type KeyboardEvent, useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import "./DatePicker.css";

export interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** 解析 YYYY-MM-DD 字符串，非法返回 null */
function parseDate(str: string): Date | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return null;
  }
  return d;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  className,
  style,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value ?? "");
  const [valid, setValid] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // disabled 时自动关闭弹层
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  // 外部 value 变化时同步 input（渲染期间调整，React 官方推荐模式）
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setInput(value ?? "");
  }

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const selectDay = useCallback(
    (d: number) => {
      const str = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      setInput(str);
      setValid(true);
      onChange?.(str);
      setOpen(false);
    },
    [year, month, onChange]
  );

  const handleInputChange = (v: string) => {
    setInput(v);
    if (v.trim() === "") {
      setValid(true);
      return;
    }
    const parsed = parseDate(v);
    if (parsed) {
      setValid(true);
      setYear(parsed.getFullYear());
      setMonth(parsed.getMonth());
      onChange?.(v);
    } else {
      setValid(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter") {
      const parsed = parseDate(input);
      if (parsed) {
        setValid(true);
        onChange?.(input);
        setOpen(false);
      }
    }
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "pixel-datepicker",
        !valid && "pixel-datepicker--invalid",
        disabled && "pixel-datepicker--disabled",
        className
      )}
      style={style}
    >
      <input
        ref={inputRef}
        className="pixel-datepicker-input"
        value={input}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => !disabled && setOpen(true)}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-invalid={!valid}
      />
      {open && (
        <div className="pixel-datepicker-popup" role="dialog" aria-label="Date picker">
          <div className="pixel-datepicker-header">
            <button type="button" onClick={() => setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1))} aria-label="Previous month">◀</button>
            <span>{year}-{String(month + 1).padStart(2, "0")}</span>
            <button type="button" onClick={() => setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1))} aria-label="Next month">▶</button>
          </div>
          <div className="pixel-datepicker-grid" role="grid">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="pixel-datepicker-weekday">{d}</div>
            ))}
            {days.map((d, i) =>
              d ? (
                <div
                  key={i}
                  className="pixel-datepicker-day"
                  onClick={() => selectDay(d)}
                  role="gridcell"
                >
                  {d}
                </div>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
