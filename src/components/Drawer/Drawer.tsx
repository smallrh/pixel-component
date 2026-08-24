import { type CSSProperties, type ReactNode, forwardRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import "./Drawer.css";
import { lockBodyScroll, unlockBodyScroll } from "../../utils/scrollLock";
import { mergeRefs } from "../../utils/mergeRefs";
import { useFocusTrap } from "../../utils/useFocusTrap";
import { useLocale, t } from "../LocaleProvider";

export interface DrawerProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调（点击遮罩/Esc/关闭按钮时触发） */
  onClose: () => void;
  /** 标题（字符串或自定义节点） */
  title?: ReactNode;
  /** 内容 */
  children: ReactNode;
  /** 抽屉位置：left / right（默认） */
  placement?: "left" | "right";
  /** 是否显示关闭按钮，默认 true */
  closable?: boolean;
  /** 点击遮罩是否关闭，默认 true */
  maskClosable?: boolean;
  /** 按 Esc 是否关闭，默认 true */
  keyboard?: boolean;
  /** 自定义类名（追加到 drawer panel） */
  className?: string;
  /** 自定义内联样式（应用到 drawer panel） */
  style?: CSSProperties;
}

/**
 * 抽屉。从侧边滑入的浮层，通过 createPortal 渲染到 body，含 Esc 关闭、遮罩点击关闭、
 * 焦点陷阱、打开聚焦与关闭还原焦点、body 滚动锁定（与 Modal 共享计数器）。
 *
 * ```tsx
 * <Drawer open={open} onClose={() => setOpen(false)} placement="right" title="标题">
 *   内容
 * </Drawer>
 * ```
 */
const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer({
  open,
  onClose,
  title,
  children,
  placement = "right",
  closable = true,
  maskClosable = true,
  keyboard = true,
  className,
  style,
}, ref) {
  const panelRef = useFocusTrap(open);
  const { messages } = useLocale();
  const titleId = useId();

  // Escape 关闭 + body 滚动锁定（共享计数器）
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (keyboard && e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    lockBodyScroll();
    return () => {
      document.removeEventListener("keydown", handleEsc);
      unlockBodyScroll();
    };
  }, [open, onClose, keyboard]);

  if (!open) return null;

  const drawer = (
    <div className="pixel-drawer-overlay" onClick={maskClosable ? onClose : undefined}>
      <div
        ref={mergeRefs(ref, panelRef)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={clsx(
          "pixel-drawer",
          `pixel-drawer--${placement}`,
          className
        )}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || closable) && (
          <div className="pixel-drawer-header">
            {title && <span id={titleId} className="pixel-drawer-title">{title}</span>}
            {closable && (
              <button
                type="button"
                className="pixel-drawer-close"
                onClick={onClose}
                aria-label={t("close", messages)}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="pixel-drawer-body">{children}</div>
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
});

export default Drawer;
