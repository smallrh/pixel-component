import { memo, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import "./List.css";
import { useVirtualList } from "./useVirtualList";

interface ListItem {
  /** 列表项唯一标识 */
  key: string;
  /** 列表项标题 */
  title: string;
  /** 列表项描述 */
  description?: string;
  /** 头像节点 */
  avatar?: ReactNode;
  /** 右侧附加内容 */
  extra?: ReactNode;
}

export interface ListProps {
  /** 数据驱动的列表项，与 children 二选一 */
  items?: ListItem[];
  /** 自定义列表内容（items 为空时使用） */
  children?: ReactNode;
  /** 是否显示边框，默认 true */
  bordered?: boolean;
  /** 列表头部内容 */
  header?: ReactNode;
  /** 列表底部内容 */
  footer?: ReactNode;
  /** 是否显示分割线，默认 true */
  split?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 是否开启虚拟滚动（大数据量场景），默认 false */
  virtual?: boolean;
  /** 虚拟滚动项高度（px），开启 virtual 时必填，固定行高 */
  itemHeight?: number;
  /** 虚拟滚动可视高度（px），开启 virtual 时必填 */
  height?: number;
}

/**
 * 数据驱动模式下的单个列表项。用 memo 包裹，避免父组件 re-render 时全量重渲染。
 * item 为对象引用，默认浅比较即可在父组件复用同一 item 引用时跳过重渲染；
 * item 内含 ReactNode（avatar/extra），无法按内容深度比较，故采用默认引用比较。
 */
const ListItemRow = memo(function ListItemRow({ item }: { item: ListItem }) {
  return (
    <div className="pixel-list-item">
      {item.avatar && <div className="pixel-list-item-avatar">{item.avatar}</div>}
      <div className="pixel-list-item-body">
        <div className="pixel-list-item-title">{item.title}</div>
        {item.description && (
          <div className="pixel-list-item-desc">{item.description}</div>
        )}
      </div>
      {item.extra && <div className="pixel-list-item-extra">{item.extra}</div>}
    </div>
  );
});

/**
 * List 列表。支持数据驱动或自定义子节点两种渲染方式，可附加头部、底部与分割线。
 * 关键特性：List.Item / List.ItemMeta 作为子组件用于灵活组合；bordered 与 split 可独立控制。
 */
export function List({
  items,
  children,
  bordered = true,
  header,
  footer,
  split = true,
  className,
  style,
  virtual,
  itemHeight,
  height,
}: ListProps) {
  const enableVirtual = !!(virtual && itemHeight && height && items);

  const { startIndex, endIndex, totalHeight, offsetY, onScroll } =
    useVirtualList({
      itemCount: items?.length ?? 0,
      itemHeight: itemHeight ?? 0,
      height: height ?? 0,
    });

  if (enableVirtual && items) {
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
        <div style={{ height, overflow: "auto" }} onScroll={onScroll}>
          <div style={{ height: totalHeight, position: "relative" }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {items.slice(startIndex, endIndex + 1).map((item) => (
                <ListItemRow key={item.key} item={item} />
              ))}
            </div>
          </div>
        </div>
        {footer && <div className="pixel-list-footer">{footer}</div>}
      </div>
    );
  }

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
        ? items.map((item) => <ListItemRow key={item.key} item={item} />)
        : children}
      {footer && <div className="pixel-list-footer">{footer}</div>}
    </div>
  );
}

export interface ItemProps {
  /** 头像节点 */
  avatar?: ReactNode;
  /** 右侧附加内容 */
  extra?: ReactNode;
  /** 底部操作区节点列表 */
  actions?: ReactNode[];
  /** 列表项主体内容 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/** List.Item 列表项。用于自定义渲染时组合头像、主体、操作区与附加内容。 */
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
  /** 头像节点 */
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

/** List.ItemMeta 列表项元信息。用于在 Item 主体中展示头像+标题+描述的结构。 */
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
