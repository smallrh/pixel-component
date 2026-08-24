import { useCallback, type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useRef, useState } from "react";
import clsx from "clsx";
import Icon from "../Icon";
import { useLocale, t } from "../LocaleProvider";
import { mergeRefs } from "../../utils/mergeRefs";
import "./Input.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** 视觉样式变体：outlined（描边，默认）/ filled（填充） */
  variant?: "outlined" | "filled";
  /** 尺寸：sm / md（默认）/ lg */
  size?: "sm" | "md" | "lg";
}

/**
 * 输入框。透传所有原生 input 属性（value、onChange、placeholder、disabled 等）。
 * 通过静态属性挂载子组件：Input.TextArea / Input.Password / Input.Search。
 *
 * ```tsx
 * <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="请输入" />
 * ```
 */
const InputBase = forwardRef<HTMLInputElement, InputProps>(function InputBase({
  variant = "outlined",
  size = "md",
  className,
  ...props
}, ref) {
  return (
    <input
      ref={ref}
      className={clsx("pixel-input", `pixel-input--${variant}`, `pixel-input--${size}`, className)}
      {...props}
    />
  );
});

// --- TextArea ---
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 视觉样式变体：outlined（描边，默认）/ filled（填充） */
  variant?: "outlined" | "filled";
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({
  variant = "outlined",
  className,
  ...props
}, ref) {
  return (
    <textarea
      ref={ref}
      className={clsx("pixel-input pixel-input--textarea", `pixel-input--${variant}`, className)}
      {...props}
    />
  );
});

// --- Password ---
export interface PasswordProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** 视觉样式变体：outlined（描边，默认）/ filled（填充） */
  variant?: "outlined" | "filled";
  /** 尺寸：sm / md（默认）/ lg */
  size?: "sm" | "md" | "lg";
}

const Password = forwardRef<HTMLInputElement, PasswordProps>(function Password({
  variant = "outlined",
  size = "md",
  className,
  ...props
}, ref) {
  const [visible, setVisible] = useState(false);
  const { messages } = useLocale();
  const toggleVisible = useCallback(() => setVisible((v) => !v), []);
  return (
    <span className="pixel-input-password-wrapper">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={clsx("pixel-input", `pixel-input--${variant}`, `pixel-input--${size}`, className)}
        {...props}
      />
      <button
        type="button"
        className="pixel-input-password-toggle"
        onClick={toggleVisible}
        tabIndex={-1}
        aria-label={visible ? t("input.hidePassword", messages) : t("input.showPassword", messages)}
      >
        <Icon name={visible ? "eye" : "eye-off"} size="sm" />
      </button>
    </span>
  );
});

// --- Search ---
export interface SearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  onSearch?: (value: string) => void;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(function Search({
  variant = "outlined",
  size = "md",
  onSearch,
  className,
  style,
  ...props
}, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages } = useLocale();
  const handleSearch = useCallback(
    () => onSearch?.(inputRef.current?.value ?? ""),
    [onSearch]
  );
  return (
    <span className="pixel-input-search-wrapper">
      <input
        ref={mergeRefs(ref, inputRef)}
        type="search"
        className={clsx("pixel-input", `pixel-input--${variant}`, `pixel-input--${size}`, className)}
        style={style}
        {...props}
      />
      <button
        type="button"
        className="pixel-input-search-btn"
        onClick={handleSearch}
        aria-label={t("input.search", messages)}
      >
        <Icon name="search" size="sm" />
      </button>
    </span>
  );
});

const Input = InputBase as typeof InputBase & {
  TextArea: typeof TextArea;
  Password: typeof Password;
  Search: typeof Search;
};

Input.TextArea = TextArea;
Input.Password = Password;
Input.Search = Search;

export default Input;
