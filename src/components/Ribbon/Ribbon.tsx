import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Ribbon.css";

export interface RibbonProps {
  children: ReactNode;
  text?: string;
  placement?: "start" | "end";
  color?: "default" | "red" | "blue" | "green";
  className?: string;
  style?: CSSProperties;
}

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