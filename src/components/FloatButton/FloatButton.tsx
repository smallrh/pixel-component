import { type ButtonHTMLAttributes, useEffect, useState } from "react";
import clsx from "clsx";
import "./FloatButton.css";

export interface FloatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

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
  visibilityHeight?: number;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
}

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
