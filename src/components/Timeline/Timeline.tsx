import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Timeline.css";

interface TimelineItem {
  key: string;
  children: ReactNode;
  color?: "default" | "red" | "green" | "blue";
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  style?: CSSProperties;
}

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