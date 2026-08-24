import { type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import "./Layout.css";

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
  /** 侧边栏宽度（px），默认 200 */
  width?: number;
  /** 是否收起，收起时宽度变为 48，默认 false */
  collapsed?: boolean;
}

/** Layout.Sider 侧边栏。收起时宽度收窄为 48px 并附加收起类名。 */
export function Sider({
  className,
  style,
  children,
  width = 200,
  collapsed = false,
}: SiderProps) {
  return (
    <aside
      className={clsx(
        "pixel-layout-sider",
        collapsed && "pixel-layout-sider--collapsed",
        className
      )}
      style={{ ...style, width: collapsed ? 48 : width }}
    >
      {children}
    </aside>
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