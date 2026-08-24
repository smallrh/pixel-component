import { type CSSProperties, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import "./Calendar.css";

export interface CalendarProps {
  /** 受控：当前选中日期 */
  value?: Date;
  /** 非受控：默认选中日期，默认今天 */
  defaultValue?: Date;
  /** 日期变化回调 */
  onChange?: (date: Date) => void;
  /** 是否全屏展示，默认 false */
  fullscreen?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
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

/**
 * Calendar 日历。按月展示日期网格，支持受控/非受控选中与月份切换。
 * 关键特性：value 受控优先于 defaultValue；高亮今日与选中日；首日对齐星期表头。
 * 键盘交互（按 ARIA APG grid 模式）：
 *   ArrowUp/Down/Left/Right 在日期单元格间移动，跨月时自动切换月份视图；
 *   Enter 由原生 button 触发选择；roving tabindex 让选中/焦点日持有 tabIndex=0。
 */
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
  const selected = isControlled ? startOfDay(value as Date) : internal;
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());
  // 焦点日：roving tabindex 持有 tabIndex=0 的日期数字（1..daysInMonth）
  const [focusedDay, setFocusedDay] = useState<number | undefined>(undefined);
  const cellRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  // 渲染完成后真正 focus 目标日期单元格，避免 render 期间 focus 触发警告
  const pendingFocusRef = useRef<number | null>(null);

  const viewDate = new Date(viewYear, viewMonth, 1);
  const firstDay = viewDate.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // 上一个月的天数（用于 ArrowLeft/Up 跨月时定位到对端日）
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
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

  // 当前视图月份与选中日同月时，默认焦点 = 选中日；否则默认为 1 号
  const focusedDayResolved = focusedDay
    ?? (selected.getFullYear() === viewYear && selected.getMonth() === viewMonth
      ? selected.getDate()
      : 1);

  const focusDay = (day: number) => {
    pendingFocusRef.current = day;
    setFocusedDay(day);
  };

  // 渲染完成后真正 focus 目标单元格；跨月切换后 cells 已包含新月份，可直接定位
  useEffect(() => {
    if (pendingFocusRef.current === null) return;
    const day = pendingFocusRef.current;
    pendingFocusRef.current = null;
    cellRefs.current.get(day)?.focus();
  });

  const handleCellKeyDown = (e: React.KeyboardEvent, day: number) => {
    let nextDay = day;
    let switchMonth: -1 | 0 | 1 = 0;
    switch (e.key) {
      case "ArrowLeft":
        if (day === 1) {
          switchMonth = -1;
          nextDay = daysInPrevMonth;
        } else {
          nextDay = day - 1;
        }
        break;
      case "ArrowRight":
        if (day === daysInMonth) {
          switchMonth = 1;
          nextDay = 1;
        } else {
          nextDay = day + 1;
        }
        break;
      case "ArrowUp":
        if (day - 7 < 1) {
          switchMonth = -1;
          nextDay = daysInPrevMonth + (day - 7);
        } else {
          nextDay = day - 7;
        }
        break;
      case "ArrowDown":
        if (day + 7 > daysInMonth) {
          switchMonth = 1;
          nextDay = (day + 7) - daysInMonth;
        } else {
          nextDay = day + 7;
        }
        break;
      case "Home":
        nextDay = 1;
        break;
      case "End":
        nextDay = daysInMonth;
        break;
      default:
        return;
    }
    e.preventDefault();
    if (switchMonth === -1) prevMonth();
    else if (switchMonth === 1) nextMonth();
    focusDay(nextDay);
  };

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
        <div className="pixel-calendar-grid" role="grid" aria-label="Calendar grid">
          {cells.map((day, idx) =>
            day === null ? (
              <span key={idx} className="pixel-calendar-cell pixel-calendar-cell--empty" />
            ) : (
              <button
                key={idx}
                ref={(el) => {
                  if (el) cellRefs.current.set(day, el);
                  else cellRefs.current.delete(day);
                }}
                type="button"
                className={clsx(
                  "pixel-calendar-cell",
                  isSameDay(selected, new Date(viewYear, viewMonth, day)) && "pixel-calendar-cell--selected",
                  isSameDay(today, new Date(viewYear, viewMonth, day)) && "pixel-calendar-cell--today"
                )}
                onClick={() => select(day)}
                onKeyDown={(e) => handleCellKeyDown(e, day)}
                tabIndex={day === focusedDayResolved ? 0 : -1}
                aria-label={`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`}
                aria-current={isSameDay(today, new Date(viewYear, viewMonth, day)) ? "date" : undefined}
                aria-pressed={isSameDay(selected, new Date(viewYear, viewMonth, day))}
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
