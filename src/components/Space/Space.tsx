import { type ReactNode } from "react";
import clsx from "clsx";
import "./Space.css";

interface SpaceProps {
  direction?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const sizeMap = {
  sm: 4,
  md: 8,
  lg: 16,
};

export default function Space({
  direction = "horizontal",
  size = "md",
  wrap = false,
  className,
  style,
  children,
}: SpaceProps) {
  return (
    <div
      className={clsx(
        "pixel-space",
        `pixel-space--${direction}`,
        `pixel-space--${size}`,
        wrap && "pixel-space--wrap",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}