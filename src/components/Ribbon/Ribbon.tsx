import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Ribbon.css";

export interface RibbonProps {
  /** 被缎带包裹的内容 */
  children: ReactNode;
  /** 缎带文本，留空则不渲染缎带 */
  text?: string;
  /** 缎带位置，默认 "end" */
  placement?: "start" | "end";
  /** 缎带颜色，默认 "default" */
  color?: "default" | "red" | "blue" | "green";
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Ribbon 缎带。
 * 在子元素角落叠加带状徽标，常用于商品卡片上的促销/标识信息。
 */
export default function Ribbon({
  children,
  text,
  placement = "end",
  color = "default",
  className,
  style,
}: RibbonProps) {
  return (
    <div className={clsx("pixel-ribbon-wrapper", className)} style={style}>
      {children}
      {text && (
        <div
          className={clsx(
            "pixel-ribbon",
            `pixel-ribbon--${color}`,
            `pixel-ribbon--${placement}`
          )}
        >
          <span className="pixel-ribbon-text">{text}</span>
        </div>
      )}
    </div>
  );
}