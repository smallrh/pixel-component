import { memo, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import "./Timeline.css";

interface TimelineItem {
  /** 列表项唯一标识 */
  key: string;
  /** 节点内容 */
  children: ReactNode;
  /** 节点圆点颜色，默认 "default" */
  color?: "default" | "red" | "green" | "blue";
}

export interface TimelineProps {
  /** 时间线节点列表 */
  items: TimelineItem[];
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

interface TimelineEntryProps {
  item: TimelineItem;
}

/**
 * memo 比较函数：返回 true 表示 props 相等（跳过重渲染）。
 * items 数组在父组件 re-render 时常为新引用，故按内容比较影响渲染的字段：
 * color（决定 className）与 children（ReactNode 按引用比较）。
 */
function areEqual(prev: TimelineEntryProps, next: TimelineEntryProps): boolean {
  if (prev.item === next.item) return true;
  return (
    prev.item.color === next.item.color &&
    prev.item.children === next.item.children
  );
}

const TimelineEntry = memo(function TimelineEntry({ item }: TimelineEntryProps) {
  return (
    <li
      className={`pixel-timeline-item pixel-timeline-item--${item.color ?? "default"}`}
    >
      <div className="pixel-timeline-dot" />
      <div className="pixel-timeline-content">{item.children}</div>
    </li>
  );
}, areEqual);

/**
 * Timeline 时间线。
 * 以垂直时间线形式按序展示节点内容，支持为每个节点指定圆点颜色。
 */
export default function Timeline({
  items,
  className,
  style,
}: TimelineProps) {
  return (
    <ul className={clsx("pixel-timeline", className)} style={style}>
      {items.map((item) => (
        <TimelineEntry key={item.key} item={item} />
      ))}
    </ul>
  );
}