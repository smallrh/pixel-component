import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx("pixel-button", `pixel-button--${variant}`, `pixel-button--${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}