import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./DatePicker.css";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  className,
  style,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const selectDay = (d: number) => {
    const str = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    onChange?.(str);
    setOpen(false);
  };

  return (
    <div ref={ref} className={clsx("pixel-datepicker", className)} style={style}>
      <input
        className="pixel-datepicker-input"
        value={value ?? ""}
        placeholder={placeholder}
        readOnly
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div className="pixel-datepicker-popup">
          <div className="pixel-datepicker-header">
            <button onClick={() => setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1))}>◀</button>
            <span>{year}-{String(month + 1).padStart(2, "0")}</span>
            <button onClick={() => setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1))}>▶</button>
          </div>
          <div className="pixel-datepicker-grid">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="pixel-datepicker-weekday">{d}</div>
            ))}
            {days.map((d, i) =>
              d ? (
                <div
                  key={i}
                  className="pixel-datepicker-day"
                  onClick={() => selectDay(d)}
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