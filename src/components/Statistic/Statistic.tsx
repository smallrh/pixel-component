import clsx from "clsx";
import "./Statistic.css";

interface StatisticProps {
  title?: React.ReactNode;
  value: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Statistic({
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