import { type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import "./Card.css";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "outlined" | "elevated" | "inset";
  size?: "sm" | "md" | "lg";
  title?: ReactNode;
  extra?: ReactNode;
  actions?: ReactNode[];
}

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
  avatar?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

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
