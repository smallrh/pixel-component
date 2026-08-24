import { memo, type CSSProperties } from "react";
import clsx from "clsx";
import "./Steps.css";

interface StepItem {
  /** 步骤标题 */
  title: string;
  /** 步骤描述 */
  description?: string;
}

export interface StepsProps {
  /** 当前步骤索引（从 0 开始） */
  current: number;
  /** 步骤列表 */
  items: StepItem[];
  /** 展示方向，默认 "horizontal" */
  direction?: "horizontal" | "vertical";
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

interface StepProps {
  item: StepItem;
  index: number;
  status: "completed" | "active" | "pending";
  direction: "horizontal" | "vertical";
  isLast: boolean;
}

/**
 * memo 比较函数：返回 true 表示 props 相等（跳过重渲染）。
 * items 数组在父组件 re-render 时常为新引用，但步骤内容（title/description）为字符串，
 * status 随 current 变化；这里按内容比较所有影响渲染的字段，使未变更的步骤跳过重渲染。
 */
function areEqual(prev: StepProps, next: StepProps): boolean {
  return (
    prev.index === next.index &&
    prev.status === next.status &&
    prev.direction === next.direction &&
    prev.isLast === next.isLast &&
    prev.item.title === next.item.title &&
    prev.item.description === next.item.description
  );
}

const Step = memo(function Step({
  item,
  index,
  status,
  direction,
  isLast,
}: StepProps) {
  return (
    <div className={clsx("pixel-step", `pixel-step--${status}`)}>
      <div className="pixel-step-indicator-wrapper">
        <div className="pixel-step-indicator">
          {status === "completed" ? (
            <span className="pixel-step-icon">✓</span>
          ) : (
            <span className="pixel-step-number">{index + 1}</span>
          )}
        </div>
        {!isLast && (
          <div
            className={clsx(
              "pixel-step-line",
              `pixel-step-line--${direction}`,
              status === "completed" && "pixel-step-line--completed"
            )}
          />
        )}
      </div>
      <div className="pixel-step-content">
        <div className="pixel-step-title">{item.title}</div>
        {item.description && (
          <div className="pixel-step-description">{item.description}</div>
        )}
      </div>
    </div>
  );
}, areEqual);

/**
 * Steps。步骤条，按 current 标记完成/进行/待办状态，支持水平与垂直两种方向。
 */
export default function Steps({
  current,
  items,
  direction = "horizontal",
  className,
  style,
}: StepsProps) {
  return (
    <div
      className={clsx("pixel-steps", `pixel-steps--${direction}`, className)}
      style={style}
    >
      {items.map((item, index) => {
        const status =
          index < current
            ? "completed"
            : index === current
              ? "active"
              : "pending";
        return (
          <Step
            key={index}
            item={item}
            index={index}
            status={status}
            direction={direction}
            isLast={index === items.length - 1}
          />
        );
      })}
    </div>
  );
}