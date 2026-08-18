import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./PageHeader.css";

export interface PageHeaderProps {
  title: ReactNode;
  subTitle?: ReactNode;
  breadcrumb?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  className?: string;
  style?: CSSProperties;
}

export default function PageHeader({
  title,
  subTitle,
  breadcrumb,
  extra,
  footer,
  onBack,
  className,
  style,
}: PageHeaderProps) {
  return (
    <div className={clsx("pixel-page-header", className)} style={style}>
      {breadcrumb && <div className="pixel-page-header-breadcrumb">{breadcrumb}</div>}
      <div className="pixel-page-header-row">
        <div className="pixel-page-header-left">
          {onBack && (
            <button type="button" className="pixel-page-header-back" onClick={onBack} aria-label="Back">
              ◀
            </button>
          )}
          <div>
            <h1 className="pixel-page-header-title">{title}</h1>
            {subTitle && <span className="pixel-page-header-subtitle">{subTitle}</span>}
          </div>
        </div>
        {extra && <div className="pixel-page-header-extra">{extra}</div>}
      </div>
      {footer && <div className="pixel-page-header-footer">{footer}</div>}
    </div>
  );
}