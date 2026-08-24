import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Badge.css";

export interface BadgeProps {
  /** 角标数字，大于 0 时显示；未设置且 dot 为 false 时不显示 */
  count?: number;
  /** 是否仅显示红点而不显示数字，默认 false */
  dot?: boolean;
  /** 数字封顶值，超出显示为 `n+`，默认 99 */
  overflowCount?: number;
  /** 被角标包裹的内容 */
  children?: ReactNode;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Badge 徽标数。
 * 在子元素右上角叠加数字或红点角标，支持溢出封顶显示。
 */
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