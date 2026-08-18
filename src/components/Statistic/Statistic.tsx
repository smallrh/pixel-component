import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import "./Statistic.css";

export interface StatisticProps {
  title?: ReactNode;
  value: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Statistic({
  title,
  value,
  prefix,
  suffix,
  className,
  style,
}: StatisticProps) {
  return (
    <div className={clsx("pixel-statistic", className)} style={style}>
      {title && <div className="pixel-statistic-title">{title}</div>}
      <div className="pixel-statistic-value">
        {prefix && <span className="pixel-statistic-prefix">{prefix}</span>}
        {value}
        {suffix && <span className="pixel-statistic-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

export interface CountdownProps {
  title?: ReactNode;
  value?: number | Date;
  prefix?: ReactNode;
  suffix?: ReactNode;
  format?: string;
  onFinish?: () => void;
  className?: string;
  style?: CSSProperties;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function msToParts(ms: number): TimeParts {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0");
}

/* 简化 format 解析：仅支持 DD / HH / mm / ss 通配符 */
function renderTime(parts: TimeParts, format: string): string {
  return format
    .replace(/DD/g, pad(parts.days))
    .replace(/HH/g, pad(parts.hours))
    .replace(/mm/g, pad(parts.minutes))
    .replace(/ss/g, pad(parts.seconds));
}

export function Countdown({
  title,
  value,
  prefix,
  suffix,
  format = "HH:mm:ss",
  onFinish,
  className,
  style,
}: CountdownProps) {
  const target = value === undefined
    ? 0
    : value instanceof Date
      ? value.getTime()
      : value;
  const [remaining, setRemaining] = useState<number>(() => Math.max(0, target - Date.now()));
  const finishedRef = useRef(false);

  useEffect(() => {
    finishedRef.current = false;
    const tick = () => {
      const left = Math.max(0, target - Date.now());
      setRemaining(left);
      if (left <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        onFinish?.();
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target, onFinish]);

  const parts = msToParts(remaining);

  return (
    <div className={clsx("pixel-statistic pixel-statistic--countdown", className)} style={style}>
      {title && <div className="pixel-statistic-title">{title}</div>}
      <div className="pixel-statistic-value pixel-statistic-countdown-value">
        {prefix && <span className="pixel-statistic-prefix">{prefix}</span>}
        {renderTime(parts, format)}
        {suffix && <span className="pixel-statistic-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

const StatisticComponent = Statistic as typeof Statistic & {
  Countdown: typeof Countdown;
};

StatisticComponent.Countdown = Countdown;

export default StatisticComponent;
