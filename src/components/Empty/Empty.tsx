import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Empty.css";
import { useLocale, t } from "../LocaleProvider";

export interface EmptyProps {
  /** 空状态描述文本，默认取自国际化 "empty.noData" */
  description?: ReactNode;
  /** 自定义空状态图像，默认渲染像素风 DefaultImage */
  image?: ReactNode;
  /** 底部补充内容，常用于放置操作按钮 */
  children?: ReactNode;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
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

/**
 * Empty 空状态。
 * 用于无数据或无内容时的占位展示，支持自定义图像、描述与底部操作。
 */
export default function Empty({
  description,
  image,
  children,
  className,
  style,
}: EmptyProps) {
  const { messages } = useLocale();
  const desc = description ?? t("empty.noData", messages);
  return (
    <div className={clsx("pixel-empty", className)} style={style}>
      <div className="pixel-empty-image-wrap">
        {image ?? <DefaultImage />}
      </div>
      {desc && <div className="pixel-empty-description">{desc}</div>}
      {children && <div className="pixel-empty-footer">{children}</div>}
    </div>
  );
}
