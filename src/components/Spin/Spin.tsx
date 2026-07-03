import clsx from "clsx";
import "./Spin.css";

interface SpinProps {
  spinning?: boolean;
  children?: React.ReactNode;
  tip?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export default function Spin({
  spinning = true,
  children,
  tip,
  size = "md",
  className,
  style,
}: SpinProps) {
  const content = (
    <div className={clsx("pixel-spin-indicator", `pixel-spin--${size}`)}>
      <div className="pixel-spin-dot" />
      {tip && <div className="pixel-spin-tip">{tip}</div>}
    </div>
  );

  if (!children) return spinning ? content : null;

  return (
    <div className={clsx("pixel-spin", className)} style={style}>
      {spinning && <div className="pixel-spin-overlay">{content}</div>}
      <div className={clsx(spinning && "pixel-spin-blur")}>{children}</div>
    </div>
  );
}