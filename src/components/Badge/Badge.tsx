import clsx from "clsx";
import "./Badge.css";

interface BadgeProps {
  count?: number;
  dot?: boolean;
  overflowCount?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Badge({
  count,
  dot = false,
  overflowCount = 99,
  children,
  className,
  style,
}: BadgeProps) {
  const showBadge = (count !== undefined && count > 0) || dot;
  const displayCount =
    count !== undefined && count > overflowCount
      ? `${overflowCount}+`
      : count;

  return (
    <span className={clsx("pixel-badge", className)} style={style}>
      {children}
      {showBadge && (
        <sup className={clsx("pixel-badge-sup", dot && "pixel-badge-sup--dot")}>
          {!dot && displayCount}
        </sup>
      )}
    </span>
  );
}