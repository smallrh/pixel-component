import { type CSSProperties, type HTMLAttributes } from "react";
import clsx from "clsx";
import "./Flex.css";

type FlexGap = number | string;
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
type FlexJustify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type FlexAlign = "flex-start" | "center" | "flex-end" | "stretch" | "baseline";

interface FlexProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  vertical?: boolean;
  wrap?: FlexWrap | boolean;
  justify?: FlexJustify;
  align?: FlexAlign;
  gap?: FlexGap | [FlexGap, FlexGap];
  flex?: CSSProperties["flex"];
  style?: CSSProperties;
}

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
