import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Breadcrumb.css";

interface BreadcrumbItem {
  title: ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Breadcrumb({
  items,
  separator = ">",
  className,
  style,
}: BreadcrumbProps) {
  return (
    <nav className={clsx("pixel-breadcrumb", className)} style={style}>
      <ol className="pixel-breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="pixel-breadcrumb-item">
              {item.href && !isLast ? (
                <a href={item.href} className="pixel-breadcrumb-link">
                  {item.title}
                </a>
              ) : (
                <span
                  className={clsx(
                    "pixel-breadcrumb-text",
                    isLast && "pixel-breadcrumb-text--active"
                  )}
                >
                  {item.title}
                </span>
              )}
              {!isLast && (
                <span className="pixel-breadcrumb-separator">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}