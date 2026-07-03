import { type HTMLAttributes } from "react";
import clsx from "clsx";
import "./Card.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "outlined" | "elevated" | "inset";
  size?: "sm" | "md" | "lg";
}

export default function Card({
  variant = "outlined",
  size = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx("pixel-card", `pixel-card--${variant}`, `pixel-card--${size}`, className)}
      {...props}
    >
      {children}
    </div>
  );
}