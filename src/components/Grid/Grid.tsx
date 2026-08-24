import { type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import "./Grid.css";

/* ── Row ── */
export interface RowProps {
  /** 栅格间距（px）；传数组时分别为 [水平, 垂直] 间距，默认 0 */
  gutter?: number | [number, number];
  /** 垂直对齐方式，默认 "top" */
  align?: "top" | "middle" | "bottom";
  /** 水平排列方式，默认 "start" */
  justify?: "start" | "end" | "center" | "space-around" | "space-between";
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 子节点（Col 列） */
  children?: ReactNode;
}

/**
 * Grid.Row 栅格行。通过 flex 布局组织子列，支持间距、对齐与排列方式。
 * 关键特性：gutter 同时映射到 column-gap/row-gap。
 */
export function Row({
  gutter = 0,
  align = "top",
  justify = "start",
  className,
  style,
  children,
}: RowProps) {
  const [horizontalGap, verticalGap] = Array.isArray(gutter)
    ? gutter
    : [gutter, 0];

  return (
    <div
      className={clsx(
        "pixel-row",
        `pixel-row--align-${align}`,
        `pixel-row--justify-${justify}`,
        className
      )}
      style={{
        ...style,
        columnGap: horizontalGap,
        rowGap: verticalGap,
      }}
    >
      {children}
    </div>
  );
}

/* ── Col ── */
type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

export interface ColProps {
  /** 栅格占据列数（1-24），默认 24 */
  span?: ColSpan;
  /** 栅格左侧偏移列数（1-24） */
  offset?: ColSpan;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 子节点 */
  children?: ReactNode;
}

/** Grid.Col 栅格列。通过 span/offset 控制在 24 栅格中所占宽度与偏移。 */
export function Col({
  span = 24,
  offset,
  className,
  style,
  children,
}: ColProps) {
  return (
    <div
      className={clsx(
        "pixel-col",
        `pixel-col--span-${span}`,
        offset && `pixel-col--offset-${offset}`,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}