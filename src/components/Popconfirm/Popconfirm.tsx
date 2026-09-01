import { type CSSProperties, forwardRef, useState, useRef, useEffect, useCallback, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";
import Button from "../Button";
import "./Popconfirm.css";
import { mergeRefs } from "../../utils/mergeRefs";
import { useLocale, t } from "../LocaleProvider";
import { usePopupPosition, popupStyle, renderPopup } from "../../utils/popup";

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
 * Popconfirm 气泡确认框。弹层 portal 到 body 避免被祖先 overflow 裁剪，
 * 支持键盘 Enter/Space 触发、Escape 取消、点击外部关闭。
 */
const POPCONFIRM_Z_INDEX = 1000;

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
  const emitOpenChange = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const pos = usePopupPosition(triggerRef, popupRef, currentOpen, "bottom");

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideTrigger = triggerRef.current?.contains(target);
      const insidePopup = popupRef.current?.contains(target);
      if (!insideTrigger && !insidePopup) {
        emitOpenChange(false);
      }
    };
    if (currentOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [currentOpen, emitOpenChange]);

  // Escape 关闭
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") emitOpenChange(false);
    };
    if (currentOpen) {
      document.addEventListener("keydown", handleKey as EventListener);
      return () => document.removeEventListener("keydown", handleKey as EventListener);
    }
  }, [currentOpen, emitOpenChange]);

  return (
    <div ref={mergeRefs(ref, triggerRef)} className={clsx("pixel-popconfirm", className)} style={style}>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
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
      {currentOpen &&
        renderPopup(
          <div
            ref={popupRef}
            role="alertdialog"
            aria-modal="true"
            className="pixel-popconfirm-card"
            style={popupStyle(pos, POPCONFIRM_Z_INDEX)}
          >
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