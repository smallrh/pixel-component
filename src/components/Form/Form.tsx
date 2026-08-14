import { type ReactNode } from "react";
import clsx from "clsx";
import "./Form.css";

interface FormItemProps {
  label?: string;
  name?: string;
  children: ReactNode;
  rules?: { required?: boolean; message?: string }[];
  className?: string;
  style?: React.CSSProperties;
}

export function FormItem({
  label,
  children,
  className,
  style,
}: FormItemProps) {
  return (
    <div className={clsx("pixel-form-item", className)} style={style}>
      {label && <label className="pixel-form-label">{label}</label>}
      <div className="pixel-form-control">{children}</div>
    </div>
  );
}

interface FormProps {
  children: ReactNode;
  onFinish?: (values: Record<string, unknown>) => void;
  onFinishFailed?: (errors: Record<string, string>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Form({
  children,
  onFinish,
  className,
  style,
}: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple form submission - collects all input values
    const formData = new FormData(e.target as HTMLFormElement);
    const values: Record<string, unknown> = {};
    formData.forEach((v, k) => {
      values[k] = v;
    });
    onFinish?.(values);
  };

  return (
    <form
      className={clsx("pixel-form", className)}
      style={style}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}