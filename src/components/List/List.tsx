import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./List.css";

interface ListItem {
  key: string;
  title: string;
  description?: string;
  avatar?: ReactNode;
  extra?: ReactNode;
}

export interface ListProps {
  items?: ListItem[];
  children?: ReactNode;
  bordered?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  split?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function List({
  items,
  children,
  bordered = true,
  header,
  footer,
  split = true,
  className,
  style,
}: ListProps) {
  return (
    <div
      className={clsx(
        "pixel-list",
        bordered && "pixel-list--bordered",
        !split && "pixel-list--no-split",
        className
      )}
      style={style}
    >
      {header && <div className="pixel-list-header">{header}</div>}
      {items
        ? items.map((item) => (
            <div key={item.key} className="pixel-list-item">
              {item.avatar && <div className="pixel-list-item-avatar">{item.avatar}</div>}
              <div className="pixel-list-item-body">
                <div className="pixel-list-item-title">{item.title}</div>
                {item.description && (
                  <div className="pixel-list-item-desc">{item.description}</div>
                )}
              </div>
              {item.extra && <div className="pixel-list-item-extra">{item.extra}</div>}
            </div>
          ))
        : children}
      {footer && <div className="pixel-list-footer">{footer}</div>}
    </div>
  );
}

export interface ItemProps {
  avatar?: ReactNode;
  extra?: ReactNode;
  actions?: ReactNode[];
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Item({ avatar, extra, actions, children, className, style }: ItemProps) {
  return (
    <div className={clsx("pixel-list-item", className)} style={style}>
      {avatar && <div className="pixel-list-item-avatar">{avatar}</div>}
      <div className="pixel-list-item-body">
        <div className="pixel-list-item-content">{children}</div>
        {actions && actions.length > 0 && (
          <div className="pixel-list-item-actions">
            {actions.map((action, idx) => (
              <span key={idx} className="pixel-list-item-action">
                {action}
              </span>
            ))}
          </div>
        )}
      </div>
      {extra && <div className="pixel-list-item-extra">{extra}</div>}
    </div>
  );
}

export interface ItemMetaProps {
  avatar?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function ItemMeta({ avatar, title, description, className, style }: ItemMetaProps) {
  return (
    <div className={clsx("pixel-list-item-meta", className)} style={style}>
      {avatar && <div className="pixel-list-item-avatar">{avatar}</div>}
      <div className="pixel-list-item-meta-detail">
        {title && <div className="pixel-list-item-title">{title}</div>}
        {description && <div className="pixel-list-item-desc">{description}</div>}
      </div>
    </div>
  );
}

const ListComponent = List as typeof List & {
  Item: typeof Item;
  ItemMeta: typeof ItemMeta;
};

ListComponent.Item = Item;
ListComponent.ItemMeta = ItemMeta;

export default ListComponent;
