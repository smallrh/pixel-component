import clsx from "clsx";
import "./Timeline.css";

interface TimelineItem {
  key: string;
  children: React.ReactNode;
  color?: "default" | "red" | "green" | "blue";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  style?: React.CSSProperties;
}

const colorDotMap: Record<string, string> = {
  default: "#000",
  red: "#000",
  green: "#000",
  blue: "#000",
};

export default function Timeline({
  items,
  className,
  style,
}: TimelineProps) {
  return (
    <ul className={clsx("pixel-timeline", className)} style={style}>
      {items.map((item) => (
        <li key={item.key} className={`pixel-timeline-item pixel-timeline-item--${item.color ?? "default"}`}>
          <div className="pixel-timeline-dot" />
          <div className="pixel-timeline-content">{item.children}</div>
        </li>
      ))}
    </ul>
  );
}