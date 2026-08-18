import { type InputHTMLAttributes, type TextareaHTMLAttributes, useRef, useState } from "react";
import clsx from "clsx";
import Icon from "../Icon";
import { useLocale, t } from "../LocaleProvider";
import "./Input.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg";
}

function InputBase({
  variant = "outlined",
  size = "md",
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={clsx("pixel-input", `pixel-input--${variant}`, `pixel-input--${size}`, className)}
      {...props}
    />
  );
}

// --- TextArea ---
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "outlined" | "filled";
}

function TextArea({
  variant = "outlined",
  className,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      className={clsx("pixel-input pixel-input--textarea", `pixel-input--${variant}`, className)}
      {...props}
    />
  );
}

// --- Password ---
export interface PasswordProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg";
}

function Password({
  variant = "outlined",
  size = "md",
  className,
  ...props
}: PasswordProps) {
  const [visible, setVisible] = useState(false);
  const { messages } = useLocale();
  return (
    <span className="pixel-input-password-wrapper">
      <input
        type={visible ? "text" : "password"}
        className={clsx("pixel-input", `pixel-input--${variant}`, `pixel-input--${size}`, className)}
        {...props}
      />
      <button
        type="button"
        className="pixel-input-password-toggle"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? t("input.hidePassword", messages) : t("input.showPassword", messages)}
      >
        <Icon name={visible ? "eye" : "eye-off"} size="sm" />
      </button>
    </span>
  );
}

// --- Search ---
export interface SearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  onSearch?: (value: string) => void;
}

function Search({
  variant = "outlined",
  size = "md",
  onSearch,
  className,
  style,
  ...props
}: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages } = useLocale();
  return (
    <span className="pixel-input-search-wrapper">
      <input
        ref={inputRef}
        type="search"
        className={clsx("pixel-input", `pixel-input--${variant}`, `pixel-input--${size}`, className)}
        style={style}
        {...props}
      />
      <button
        type="button"
        className="pixel-input-search-btn"
        onClick={() => onSearch?.(inputRef.current?.value ?? "")}
        aria-label={t("input.search", messages)}
      >
        <Icon name="search" size="sm" />
      </button>
    </span>
  );
}

const Input = InputBase as typeof InputBase & {
  TextArea: typeof TextArea;
  Password: typeof Password;
  Search: typeof Search;
};

Input.TextArea = TextArea;
Input.Password = Password;
Input.Search = Search;

export default Input;