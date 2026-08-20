import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Breadcrumb.css";

export interface BreadcrumbItem {
  title: ReactNode;
  href?: string;
  /** 点击非末级项回调（含 href 时仍渲染 <a>，可阻止默认跳转自行处理） */
  onClick?: (item: BreadcrumbItem, index: number) => void;
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
          const clickable = !isLast && item.onClick;
          return (
            <li key={index} className="pixel-breadcrumb-item">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="pixel-breadcrumb-link"
                  onClick={(e) => {
                    item.onClick?.(item, index);
                    if (item.onClick) e.preventDefault();
                  }}
                >
                  {item.title}
                </a>
              ) : (
                <span
                  className={clsx(
                    "pixel-breadcrumb-text",
                    isLast && "pixel-breadcrumb-text--active",
                    clickable && "pixel-breadcrumb-text--clickable"
                  )}
                  onClick={clickable ? () => item.onClick?.(item, index) : undefined}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            item.onClick?.(item, index);
                          }
                        }
                      : undefined
                  }
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