import { type CSSProperties, useState } from "react";
import clsx from "clsx";
import "./Calendar.css";

export interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  fullscreen?: boolean;
  className?: string;
  style?: CSSProperties;
}

const WEEK_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function Calendar({
  value,
  defaultValue,
  onChange,
  fullscreen = false,
  className,
  style,
}: CalendarProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ? startOfDay(defaultValue) : startOfDay(new Date()));
  const selected = isControlled ? startOfDay(value) : internal;
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  const viewDate = new Date(viewYear, viewMonth, 1);
  const firstDay = viewDate.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = startOfDay(new Date());

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    setViewMonth((m) => (m === 0 ? 11 : m - 1));
    if (viewMonth === 0) setViewYear((y) => y - 1);
  };

  const nextMonth = () => {
    setViewMonth((m) => (m === 11 ? 0 : m + 1));
    if (viewMonth === 11) setViewYear((y) => y + 1);
  };

  const select = (day: number) => {
    const next = new Date(viewYear, viewMonth, day);
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className={clsx("pixel-calendar", fullscreen && "pixel-calendar--fullscreen", className)} style={style}>
      <div className="pixel-calendar-header">
        <button
          type="button"
          className="pixel-calendar-nav pixel-calendar-nav--prev"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          ◀
        </button>
        <span className="pixel-calendar-title">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          className="pixel-calendar-nav pixel-calendar-nav--next"
          onClick={nextMonth}
          aria-label="Next month"
        >
          ▶
        </button>
      </div>
      <div className="pixel-calendar-body">
        <div className="pixel-calendar-week">
          {WEEK_HEADERS.map((w, i) => (
            <span key={i} className="pixel-calendar-week-cell">{w}</span>
          ))}
        </div>
        <div className="pixel-calendar-grid">
          {cells.map((day, idx) =>
            day === null ? (
              <span key={idx} className="pixel-calendar-cell pixel-calendar-cell--empty" />
            ) : (
              <button
                key={idx}
                type="button"
                className={clsx(
                  "pixel-calendar-cell",
                  isSameDay(selected, new Date(viewYear, viewMonth, day)) && "pixel-calendar-cell--selected",
                  isSameDay(today, new Date(viewYear, viewMonth, day)) && "pixel-calendar-cell--today"
                )}
                onClick={() => select(day)}
              >
                {day}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
