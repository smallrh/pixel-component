import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import "./FloatButton.css";

interface FloatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export default function FloatButton({
  variant = "primary",
  size = "md",
  position = "bottom-right",
  className,
  children,
  ...props
}: FloatButtonProps) {
  return (
    <button
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