import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./PageHeader.css";

export interface PageHeaderProps {
  /** 主标题 */
  title: ReactNode;
  /** 副标题 */
  subTitle?: ReactNode;
  /** 面包屑区域内容 */
  breadcrumb?: ReactNode;
  /** 右侧操作区内容 */
  extra?: ReactNode;
  /** 底部内容 */
  footer?: ReactNode;
  /** 返回按钮点击回调，设置后会渲染返回按钮 */
  onBack?: () => void;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * PageHeader 页头。
 * 用于页面顶部信息展示，集成面包屑、标题、副标题、返回按钮与操作区。
 */
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