import { type CSSProperties, forwardRef, useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import "./Modal.css";
import { lockBodyScroll, unlockBodyScroll } from "../../utils/scrollLock";
import { mergeRefs } from "../../utils/mergeRefs";
import { useFocusTrap } from "../../utils/useFocusTrap";
import { useLocale, t } from "../LocaleProvider";

export interface ModalProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调（点击遮罩/Esc/关闭按钮时触发） */
  onClose: () => void;
  /** 标题（字符串或自定义节点） */
  title?: ReactNode;
  /** 内容 */
  children: ReactNode;
  /** 尺寸：sm / md（默认）/ lg */
  size?: "sm" | "md" | "lg";
  /** 是否显示右上角关闭按钮，默认 true */
  closable?: boolean;
  /** 点击遮罩是否关闭，默认 true */
  maskClosable?: boolean;
  /** 按 Esc 是否关闭，默认 true */
  keyboard?: boolean;
  /** 底部内容（传入 undefined 则不渲染底部） */
  footer?: ReactNode;
  /** 自定义类名（追加到 dialog panel） */
  className?: string;
  /** 自定义内联样式（应用到 dialog panel） */
  style?: CSSProperties;
}

/**
 * 模态对话框。通过 createPortal 渲染到 body，含 Esc 关闭、遮罩点击关闭、
 * 焦点陷阱（Tab 循环）、打开聚焦与关闭还原焦点、body 滚动锁定（共享计数器）。
 *
 * ```tsx
 * <Modal open={open} onClose={() => setOpen(false)} title="标题">
 *   内容
 * </Modal>
 * ```
 */
const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  closable = true,
  maskClosable = true,
  keyboard = true,
  footer,
  className,
  style,
}, ref) {
  const panelRef = useFocusTrap(open);
  const { messages } = useLocale();
  const titleId = useId();

  // Escape 关闭 + body 滚动锁定（共享计数器）
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (keyboard && e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    lockBodyScroll();
    return () => {
      window.removeEventListener("keydown", handleKey);
      unlockBodyScroll();
    };
  }, [open, onClose, keyboard]);

  if (!open) return null;

  const modal = (
    <div className="pixel-modal-overlay" onClick={maskClosable ? onClose : undefined}>
      <div
        ref={mergeRefs(ref, panelRef)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={clsx("pixel-modal", `pixel-modal--${size}`, className)}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="pixel-modal-header">
            <span id={titleId} className="pixel-modal-title">{title}</span>
            {closable && (
              <button
                type="button"
                className="pixel-modal-close"
                onClick={onClose}
                aria-label={t("close", messages)}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="pixel-modal-body">{children}</div>
        {footer !== undefined && <div className="pixel-modal-footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
});

export default Modal;
