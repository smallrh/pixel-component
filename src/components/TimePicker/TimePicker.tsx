import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import "./TimePicker.css";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function TimePicker({
  value,
  onChange,
  className,
  style,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  const select = () => {
    const str = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    onChange?.(str);
    setOpen(false);
  };

  return (
    <div ref={ref} className={clsx("pixel-timepicker", className)} style={style}>
      <input
        className="pixel-timepicker-input"
        value={value ?? ""}
        placeholder="HH:MM"
        readOnly
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div className="pixel-timepicker-popup">
          <div className="pixel-timepicker-selectors">
            <div className="pixel-timepicker-col">
              {Array.from({ length: 24 }).map((_, h) => (
                <div
                  key={h}
                  className={clsx("pixel-timepicker-opt", hour === h && "pixel-timepicker-opt--sel")}
                  onClick={() => setHour(h)}
                >
                  {String(h).padStart(2, "0")}
                </div>
              ))}
            </div>
            <div className="pixel-timepicker-col">
              {Array.from({ length: 60 }).map((_, m) => (
                <div
                  key={m}
                  className={clsx("pixel-timepicker-opt", minute === m && "pixel-timepicker-opt--sel")}
                  onClick={() => setMinute(m)}
                >
                  {String(m).padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>
          <button className="pixel-timepicker-ok" onClick={select}>
            OK
          </button>
        </div>
      )}
    </div>
  );
}