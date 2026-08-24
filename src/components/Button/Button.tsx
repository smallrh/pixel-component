import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 视觉样式变体：primary（主按钮，默认）/ secondary（次按钮）/ danger（危险按钮） */
  variant?: "primary" | "secondary" | "danger";
  /** 尺寸：sm / md（默认）/ lg */
  size?: "sm" | "md" | "lg";
}

/**
 * 按钮。支持 primary/secondary/danger 三种变体与 sm/md/lg 三种尺寸，
 * 透传所有原生 button 属性（onClick、disabled、type 等）。
 *
 * ```tsx
 * <Button variant="primary" size="md" onClick={handle}>确定</Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  children,
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx("pixel-button", `pixel-button--${variant}`, `pixel-button--${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
