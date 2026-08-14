import type { ReactNode } from "react";
import clsx from "clsx";
import "./Empty.css";

interface EmptyProps {
  description?: ReactNode;
  image?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function DefaultImage() {
  return (
    <svg
      className="pixel-empty-image"
      viewBox="0 0 64 64"
      width="48"
      height="48"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="56" height="56" fill="none" stroke="#000" strokeWidth="2" />
      <rect x="12" y="12" width="40" height="8" fill="#000" />
      <rect x="12" y="24" width="40" height="2" fill="#000" />
      <rect x="12" y="30" width="24" height="2" fill="#000" />
      <rect x="12" y="36" width="30" height="2" fill="#000" />
      <rect x="12" y="42" width="16" height="2" fill="#000" />
      <rect x="44" y="40" width="10" height="10" fill="none" stroke="#000" strokeWidth="2" />
      <rect x="46" y="42" width="6" height="6" fill="#000" />
    </svg>
  );
}

export default function Empty({
  description = "No data",
  image,
  children,
  className,
  style,
}: EmptyProps) {
  return (
    <div className={clsx("pixel-empty", className)} style={style}>
      <div className="pixel-empty-image-wrap">
        {image ?? <DefaultImage />}
      </div>
      {description && <div className="pixel-empty-description">{description}</div>}
      {children && <div className="pixel-empty-footer">{children}</div>}
    </div>
  );
}
