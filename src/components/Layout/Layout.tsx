import { type CSSProperties, type ReactNode, useCallback, useState } from "react";
import clsx from "clsx";
import "./Layout.css";
import { SiderContext } from "./SiderContext";

export interface LayoutProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 子节点（Header/Sider/Content/Footer 组合） */
  children?: ReactNode;
  /** 是否包含侧边栏（影响布局类名），默认 false */
  hasSider?: boolean;
}

/**
 * Layout 布局。页面整体布局容器，由 Header/Sider/Content/Footer 组合构成。
 * 关键特性：hasSider 控制是否启用侧边栏布局类名；子组件语义化渲染为对应 HTML 元素。
 */
export default function Layout({
  className,
  style,
  children,
  hasSider = false,
}: LayoutProps) {
  return (
    <section
      className={clsx(
        "pixel-layout",
        hasSider && "pixel-layout--has-sider",
        className
      )}
      style={style}
    >
      {children}
    </section>
  );
}

/* ── Header ── */
/** Layout.Header 顶部布局。渲染为 header 元素。 */
export function Header({
  className,
  style,
  children,
}: {
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 子节点 */
  children?: ReactNode;
}) {
  return (
    <header className={clsx("pixel-layout-header", className)} style={style}>
      {children}
    </header>
  );
}

/* ── Sider ── */
export interface SiderProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 子节点 */
  children?: ReactNode;
  /** 侧边栏展开宽度（px），默认 200 */
  width?: number;
  /** 侧边栏折叠宽度（px），默认 48 */
  collapsedWidth?: number;
  /** 受控：是否折叠 */
  collapsed?: boolean;
  /** 非受控：初始是否折叠 */
  defaultCollapsed?: boolean;
  /** 是否可折叠（保留 prop 以备未来扩展） */
  collapsible?: boolean;
  /** 折叠状态变化回调 */
  onCollapse?: (collapsed: boolean) => void;
}

/** Layout.Sider 侧边栏。收起时宽度收窄为 collapsedWidth（默认 48px）并附加收起类名。 */
export function Sider({
  className,
  style,
  children,
  width = 200,
  collapsedWidth = 48,
  collapsed,
  defaultCollapsed = false,
  collapsible = true,
  onCollapse,
}: SiderProps) {
  // 受控/非受控折叠状态
  const isControlled = collapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const currentCollapsed = isControlled ? collapsed : internalCollapsed;

  const currentWidth = currentCollapsed ? collapsedWidth : width;

  const emitCollapse = useCallback(
    (next: boolean) => {
      if (collapsible === false) return;
      if (!isControlled) setInternalCollapsed(next);
      onCollapse?.(next);
    },
    [collapsible, isControlled, onCollapse]
  );

  return (
    <SiderContext.Provider value={{ collapsed: currentCollapsed }}>
      <aside
        className={clsx(
          "pixel-layout-sider",
          currentCollapsed && "pixel-layout-sider--collapsed",
          className
        )}
        style={{ ...style, width: currentWidth }}
      >
        {children}
      </aside>
    </SiderContext.Provider>
  );
}

/* ── Content ── */
/** Layout.Content 主体内容区。渲染为 main 元素。 */
export function Content({
  className,
  style,
  children,
}: {
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 子节点 */
  children?: ReactNode;
}) {
  return (
    <main className={clsx("pixel-layout-content", className)} style={style}>
      {children}
    </main>
  );
}

/* ── Footer ── */
/** Layout.Footer 底部布局。渲染为 footer 元素。 */
export function Footer({
  className,
  style,
  children,
}: {
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: React.CSSProperties;
  /** 子节点 */
  children?: ReactNode;
}) {
  return (
    <footer className={clsx("pixel-layout-footer", className)} style={style}>
      {children}
    </footer>
  );
}