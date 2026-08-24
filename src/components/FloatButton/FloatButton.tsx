import { type ButtonHTMLAttributes, useEffect, useState } from "react";
import clsx from "clsx";
import "./FloatButton.css";

export interface FloatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 视觉变体，默认 "primary" */
  variant?: "primary" | "secondary" | "danger";
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 固定位置，默认 "bottom-right" */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

/**
 * FloatButton。浮动按钮，固定在视口角落，承载自定义内容与原生按钮属性。
 */
export function FloatButton({
  variant = "primary",
  size = "md",
  position = "bottom-right",
  className,
  children,
  ...props
}: FloatButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "pixel-float-button",
        `pixel-float-button--${variant}`,
        `pixel-float-button--${size}`,
        `pixel-float-button--${position}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface BackTopProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** 滚动超过此高度才显示，默认 400 */
  visibilityHeight?: number;
  /** 固定位置，默认 "bottom-right" */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** 尺寸，默认 "md" */
  size?: "sm" | "md" | "lg";
  /** 视觉变体，默认 "primary" */
  variant?: "primary" | "secondary" | "danger";
  /** 点击回调（在平滑滚动到顶部之后触发） */
  onClick?: () => void;
}

/**
 * BackTop。返回顶部按钮，滚动超过 visibilityHeight 后出现，点击平滑滚动到页面顶部。
 */
export function BackTop({
  visibilityHeight = 400,
  position = "bottom-right",
  size = "md",
  variant = "primary",
  className,
  children,
  onClick,
  ...props
}: BackTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > visibilityHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [visibilityHeight]);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={clsx(
        "pixel-float-button",
        `pixel-float-button--${variant}`,
        `pixel-float-button--${size}`,
        `pixel-float-button--${position}`,
        "pixel-float-button--back-top",
        className
      )}
      aria-label="Back to top"
      title="Back to top"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClick?.();
      }}
      {...props}
    >
      {children ?? "↑"}
    </button>
  );
}

const FloatButtonComponent = FloatButton as typeof FloatButton & {
  BackTop: typeof BackTop;
};

FloatButtonComponent.BackTop = BackTop;

export default FloatButtonComponent;
