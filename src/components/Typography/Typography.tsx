import { type CSSProperties, type ReactNode, type AnchorHTMLAttributes } from "react";
import clsx from "clsx";
import "./Typography.css";

/* ── Title ── */
export interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Title({ level = 1, children, className, style }: TitleProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5";
  return (
    <Tag className={clsx("pixel-title", `pixel-title--h${level}`, className)} style={style}>
      {children}
    </Tag>
  );
}

/* ── Text ── */
export interface TextProps {
  type?: "default" | "secondary" | "disabled";
  strong?: boolean;
  code?: boolean;
  mark?: boolean;
  delete?: boolean;
  underline?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Text({
  type = "default",
  strong,
  code,
  mark,
  delete: del,
  underline,
  children,
  className,
  style,
}: TextProps) {
  const content = (
    <span
      className={clsx(
        "pixel-text",
        `pixel-text--${type}`,
        strong && "pixel-text--strong",
        mark && "pixel-text--mark",
        underline && "pixel-text--underline",
        className
      )}
      style={style}
    >
      {del ? <s className="pixel-text-del">{children}</s> : children}
    </span>
  );

  if (code) return <code className="pixel-text-code">{content}</code>;
  return content;
}

/* ── Paragraph ── */
export interface ParagraphProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Paragraph({ children, className, style }: ParagraphProps) {
  return (
    <p className={clsx("pixel-paragraph", className)} style={style}>
      {children}
    </p>
  );
}

/* ── Link ── */
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
  className?: string;
}

export function Link({ children, className, href, ...props }: LinkProps) {
  return (
    <a
      href={href}
      className={clsx("pixel-link", className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}