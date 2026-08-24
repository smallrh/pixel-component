import { type CSSProperties, type ReactNode, type AnchorHTMLAttributes } from "react";
import clsx from "clsx";
import "./Typography.css";

/* ── Title ── */
export interface TitleProps {
  /** 标题级别（h1-h5），默认 1 */
  level?: 1 | 2 | 3 | 4 | 5;
  /** 子节点 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/** Typography.Title 标题。按 level 渲染为对应级别的标题元素。 */
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
  /** 文本类型，默认 "default" */
  type?: "default" | "secondary" | "disabled";
  /** 是否加粗 */
  strong?: boolean;
  /** 是否以代码样式展示 */
  code?: boolean;
  /** 是否标记（高亮背景） */
  mark?: boolean;
  /** 是否带删除线 */
  delete?: boolean;
  /** 是否带下划线 */
  underline?: boolean;
  /** 子节点 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/** Typography.Text 文本。支持类型、加粗、代码、标记、删除线、下划线等修饰。 */
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
  /** 子节点 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/** Typography.Paragraph 段落。渲染为 p 元素。 */
export function Paragraph({ children, className, style }: ParagraphProps) {
  return (
    <p className={clsx("pixel-paragraph", className)} style={style}>
      {children}
    </p>
  );
}

/* ── Link ── */
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 链接内容 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
}

/** Typography.Link 链接。默认新窗口打开并附加 noopener noreferrer。 */
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