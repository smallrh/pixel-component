import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import "./Toast.css";

/** 退出过渡时长（毫秒），需与 CSS 中 closing 动画时长保持一致（对应 --pixel-transition-slow） */
const CLOSE_ANIM_MS = 240;

export interface ToastProps {
  /** 是否展示（受控） */
  open: boolean;
  /** 关闭回调，动画结束后触发 */
  onClose: () => void;
  /** 文案内容 */
  message: string;
  /** 展示时长（毫秒），默认 5000；传 0 则不自动关闭 */
  duration?: number;
  /** 视觉变体，默认 "default" */
  variant?: "default" | "success" | "error" | "warning";
  /** 右侧自定义操作区 */
  action?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Toast。轻提示，受控开关，duration 后进入关闭动画并触发 onClose。
 */
export default function Toast({
  open,
  onClose,
  message,
  duration = 5000,
  variant = "default",
  action,
  className,
  style,
}: ToastProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setClosing(false);
    if (open && duration > 0) {
      const timer = setTimeout(() => setClosing(true), duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration]);

  useEffect(() => {
    if (closing) {
      const timer = setTimeout(onClose, CLOSE_ANIM_MS);
      return () => clearTimeout(timer);
    }
  }, [closing, onClose]);

  if (!open) return null;

  return (
    <div
      className={clsx(
        "pixel-toast",
        `pixel-toast--${variant}`,
        closing && "pixel-toast--closing",
        className
      )}
      style={style}
      onAnimationEnd={() => {
        if (closing) onClose();
      }}
    >
      <span className="pixel-toast-message">{message}</span>
      {action && <div className="pixel-toast-action">{action}</div>}
      <button
        type="button"
        className="pixel-toast-close"
        onClick={() => {
          if (!closing) setClosing(true);
        }}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
