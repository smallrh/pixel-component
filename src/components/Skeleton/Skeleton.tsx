import clsx from "clsx";
import "./Skeleton.css";

interface SkeletonProps {
  active?: boolean;
  rows?: number;
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({
  active = true,
  rows = 3,
  width,
  className,
  style,
}: SkeletonProps) {
  return (
    <div className={clsx("pixel-skeleton", active && "pixel-skeleton--active", className)} style={style}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="pixel-skeleton-line"
          style={{
            width: width ?? (i === rows - 1 ? "60%" : "100%"),
          }}
        />
      ))}
    </div>
  );
}