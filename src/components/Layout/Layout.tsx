import { type ReactNode } from "react";
import clsx from "clsx";
import "./Layout.css";

interface LayoutProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  hasSider?: boolean;
}

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
export function Header({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}) {
  return (
    <header className={clsx("pixel-layout-header", className)} style={style}>
      {children}
    </header>
  );
}

/* ── Sider ── */
interface SiderProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  width?: number;
  collapsed?: boolean;
}

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
export function Content({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}) {
  return (
    <main className={clsx("pixel-layout-content", className)} style={style}>
      {children}
    </main>
  );
}

/* ── Footer ── */
export function Footer({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}) {
  return (
    <footer className={clsx("pixel-layout-footer", className)} style={style}>
      {children}
    </footer>
  );
}