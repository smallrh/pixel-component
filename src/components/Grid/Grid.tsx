import { type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import "./Grid.css";

/* ── Row ── */
export interface RowProps {
  gutter?: number | [number, number];
  align?: "top" | "middle" | "bottom";
  justify?: "start" | "end" | "center" | "space-around" | "space-between";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

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
  span?: ColSpan;
  offset?: ColSpan;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

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