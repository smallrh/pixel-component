import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Tag.css";

export interface TagProps {
  children: ReactNode;
  /** 是否可关闭，默认 false */
  closable?: boolean;
  /** 关闭按钮点击回调 */
  onClose?: () => void;
  /** 标签颜色，默认 "default" */
  color?: "default" | "red" | "green" | "blue" | "yellow";
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  default: { bg: "#fff", text: "#000" },
  red: { bg: "#000", text: "#fff" },
  green: { bg: "#fff", text: "#000" },
  blue: { bg: "#000", text: "#fff" },
  yellow: { bg: "#fff", text: "#000" },
};

/**
 * Tag 标签。
 * 以像素风格徽标形式展示分类或状态信息，支持可关闭交互与配色方案。
 */
export default function Tag({
  children,
  closable = false,
  onClose,
  color = "default",
  className,
  style,
}: TagProps) {
  const colors = colorMap[color] ?? colorMap.default;

  return (
    <span
      className={clsx("pixel-tag", `pixel-tag--${color}`, className)}
      style={{
        background: colors.bg,
        color: colors.text,
        borderColor: colors.text,
        ...style,
      }}
    >
      {children}
      {closable && (
        <button
          type="button"
          className="pixel-tag-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </span>
  );
}