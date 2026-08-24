import { type CSSProperties, forwardRef, useState, useRef, useEffect, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";
import Button from "../Button";
import "./Popconfirm.css";
import { mergeRefs } from "../../utils/mergeRefs";
import { useLocale, t } from "../LocaleProvider";

export interface PopconfirmProps {
  /** 确认提示标题 */
  title: ReactNode;
  /** 触发元素 */
  children: ReactNode;
  /** 确认回调 */
  onConfirm?: () => void;
  /** 取消回调 */
  onCancel?: () => void;
  /** 确认按钮文案，默认取本地化文案 */
  okText?: string;
  /** 取消按钮文案，默认取本地化文案 */
  cancelText?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 是否展开（受控） */
  open?: boolean;
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Popconfirm。气泡确认框，点击触发元素弹出确认/取消操作，点击外部自动关闭。
 */
const Popconfirm = forwardRef<HTMLDivElement, PopconfirmProps>(function Popconfirm({
  title,
  children,
  onConfirm,
  onCancel,
  okText,
  cancelText,
  className,
  style,
  open,
  onOpenChange,
}, ref) {
  const { messages } = useLocale();
  const ok = okText ?? t("popconfirm.ok", messages);
  const cancel = cancelText ?? t("popconfirm.cancel", messages);
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const currentOpen = isControlled ? open : internalOpen;
  const emitOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        emitOpenChange(false);
      }
    };
    if (currentOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [currentOpen]);

  return (
    <div ref={mergeRefs(ref, rootRef)} className={clsx("pixel-popconfirm", className)} style={style}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={currentOpen}
        onClick={() => emitOpenChange(!currentOpen)}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            emitOpenChange(!currentOpen);
          }
        }}
      >
        {children}
      </div>
      {currentOpen && (
        <div className="pixel-popconfirm-card">
          <div className="pixel-popconfirm-title">{title}</div>
          <div className="pixel-popconfirm-actions">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onCancel?.();
                emitOpenChange(false);
              }}
            >
              {cancel}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                onConfirm?.();
                emitOpenChange(false);
              }}
            >
              {ok}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Popconfirm;