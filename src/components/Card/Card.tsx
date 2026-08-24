import { type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import "./Card.css";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** 视觉变体，默认 "outlined" */
  variant?: "outlined" | "elevated" | "inset";
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 卡片标题 */
  title?: ReactNode;
  /** 标题右侧的附加区域 */
  extra?: ReactNode;
  /** 底部操作区节点列表 */
  actions?: ReactNode[];
}

/**
 * Card。卡片容器，可选标题/附加区/操作区与多种视觉变体，通过 Card.Meta 挂载摘要信息。
 */
export function Card({
  variant = "outlined",
  size = "md",
  title,
  extra,
  actions,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx("pixel-card", `pixel-card--${variant}`, `pixel-card--${size}`, className)}
      {...props}
    >
      {(title || extra) && (
        <div className="pixel-card-header">
          <div className="pixel-card-title">{title}</div>
          {extra && <div className="pixel-card-extra">{extra}</div>}
        </div>
      )}
      <div className="pixel-card-body">{children}</div>
      {actions && actions.length > 0 && (
        <div className="pixel-card-actions">
          {actions.map((action, idx) => (
            <div key={idx} className="pixel-card-action">
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface MetaProps {
  /** 头像区 */
  avatar?: ReactNode;
  /** 标题 */
  title?: ReactNode;
  /** 描述 */
  description?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Card.Meta。卡片摘要子组件，展示头像、标题与描述。
 */
export function Meta({ avatar, title, description, className, style }: MetaProps) {
  return (
    <div className={clsx("pixel-card-meta", className)} style={style}>
      {avatar && <div className="pixel-card-meta-avatar">{avatar}</div>}
      <div className="pixel-card-meta-detail">
        {title && <div className="pixel-card-meta-title">{title}</div>}
        {description && <div className="pixel-card-meta-description">{description}</div>}
      </div>
    </div>
  );
}

const CardComponent = Card as typeof Card & {
  Meta: typeof Meta;
};

CardComponent.Meta = Meta;

export default CardComponent;
