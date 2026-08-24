import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import "./Statistic.css";

export interface StatisticProps {
  /** 标题 */
  title?: ReactNode;
  /** 数值内容 */
  value: ReactNode;
  /** 数值前缀 */
  prefix?: ReactNode;
  /** 数值后缀 */
  suffix?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Statistic 统计数值。展示标题、数值及前后缀。
 * 关键特性：通过 Statistic.Countdown 子组件复用展示倒计时。
 */
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
  /** 标题 */
  title?: ReactNode;
  /** 倒计时目标，时间戳（ms）或 Date 对象 */
  value?: number | Date;
  /** 数值前缀 */
  prefix?: ReactNode;
  /** 数值后缀 */
  suffix?: ReactNode;
  /** 时间格式（支持 DD/HH/mm/ss），默认 "HH:mm:ss" */
  format?: string;
  /** 倒计时结束回调 */
  onFinish?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
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

/** Statistic.Countdown 倒计时。按秒 tick 计算剩余时间并以 format 格式化展示。 */
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
