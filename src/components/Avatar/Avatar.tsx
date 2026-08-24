import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import "./Avatar.css";

export interface AvatarProps {
  /** 文本头像内容，src 存在时会被忽略 */
  children?: ReactNode;
  /** 图片地址，设置后将以图片形式渲染头像 */
  src?: string;
  /** 图片替代文本，默认 "" */
  alt?: string;
  /** 头像尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Avatar 头像。
 * 支持图片或文本形式展示用户/对象头像，提供三档预设尺寸。
 */
export default function Avatar({
  children,
  src,
  alt = "",
  size = "md",
  className,
  style,
}: AvatarProps) {
  const sizeMap = { sm: 24, md: 32, lg: 48 };

  return (
    <span
      className={clsx("pixel-avatar", `pixel-avatar--${size}`, className)}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        ...style,
      }}
    >
      {src ? (
        <img className="pixel-avatar-img" src={src} alt={alt} />
      ) : (
        <span className="pixel-avatar-text">{children}</span>
      )}
    </span>
  );
}