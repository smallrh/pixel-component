import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx("pixel-button", `pixel-button--${variant}`, `pixel-button--${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}