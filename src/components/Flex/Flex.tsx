import { type CSSProperties, type HTMLAttributes } from "react";
import clsx from "clsx";
import "./Flex.css";

type FlexGap = number | string;
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
type FlexJustify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type FlexAlign = "flex-start" | "center" | "flex-end" | "stretch" | "baseline";

export interface FlexProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  /** 是否纵向排列，默认 false（水平方向） */
  vertical?: boolean;
  /** 换行方式，传 true 等价于 "wrap" */
  wrap?: FlexWrap | boolean;
  /** 主轴对齐方式 */
  justify?: FlexJustify;
  /** 交叉轴对齐方式 */
  align?: FlexAlign;
  /** 间距，可为单值或 [行间距, 列间距] */
  gap?: FlexGap | [FlexGap, FlexGap];
  /** flex CSS 简写属性，写入 style.flex */
  flex?: CSSProperties["flex"];
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Flex。弹性布局容器，封装 flexbox 常用能力，支持方向、对齐、换行与间距的快捷配置。
 */
export default function Flex({
  vertical = false,
  wrap = false,
  justify,
  align,
  gap,
  flex,
  className,
  style,
  children,
  ...props
}: FlexProps) {
  const gapStyle =
    gap === undefined
      ? undefined
      : Array.isArray(gap)
        ? { rowGap: gap[0], columnGap: gap[1] }
        : { gap };

  return (
    <div
      className={clsx(
        "pixel-flex",
        vertical && "pixel-flex--vertical",
        wrap === true && "pixel-flex--wrap",
        wrap === "wrap" && "pixel-flex--wrap",
        wrap === "wrap-reverse" && "pixel-flex--wrap-reverse",
        wrap === "nowrap" && "pixel-flex--nowrap",
        justify && `pixel-flex--justify-${justify}`,
        align && `pixel-flex--align-${align}`,
        className
      )}
      style={{ ...gapStyle, ...(flex !== undefined ? { flex } : {}), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
