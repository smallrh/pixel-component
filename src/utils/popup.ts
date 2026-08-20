/**
 * 浮层（Popover/Popup）通用工具：
 * - 渲染到 document.body（portal），避免被祖先 overflow/transform 裁剪或遮挡
 * - fixed 定位 + 视口碰撞翻转（空间不足时自动上下/左右翻转并夹紧边界）
 *
 * 修复：Select / Tooltip / TimePicker 等弹层原先渲染在文档流内，
 * 存在被 overflow: hidden 裁剪、被后续元素遮挡、无碰撞检测的问题。
 */
import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { createPortal } from "react-dom";

export type PopupPlacement =
  | "topLeft"
  | "top"
  | "topRight"
  | "bottomLeft"
  | "bottom"
  | "bottomRight"
  | "left"
  | "right";

export interface PopupPosition {
  top: number;
  left: number;
}

const DEFAULT_GAP = 4;
const MARGIN = 8; // 距视口边缘的最小距离

/**
 * 计算浮层定位（基于 trigger 与 popup 的实际尺寸，含碰撞翻转）。
 * 需在浮层渲染后调用（内部使用 rAF 等待布局完成）。
 */
export function usePopupPosition(
  triggerRef: RefObject<HTMLElement | null>,
  popupRef: RefObject<HTMLElement | null>,
  open: boolean,
  placement: PopupPlacement = "bottomLeft",
  gap: number = DEFAULT_GAP
): PopupPosition {
  const [pos, setPos] = useState<PopupPosition>({ top: -9999, left: -9999 });

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const trigger = triggerRef.current;
      const popup = popupRef.current;
      if (!trigger || !popup) return;

      const tr = trigger.getBoundingClientRect();
      const pr = popup.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const fitsBelow = tr.bottom + gap + pr.height + MARGIN <= vh;
      const fitsAbove = tr.top - gap - pr.height - MARGIN >= 0;
      const fitsRight = tr.left + pr.width + MARGIN <= vw;
      const fitsLeft = tr.left - pr.width - MARGIN >= 0;

      let top: number;
      let left: number;

      // 左右型 placement（Tooltip 等）：垂直居中，水平靠左/靠右
      if (placement === "left" || placement === "right") {
        const horizontal: "left" | "right" =
          placement === "right" ? (fitsRight ? "right" : "left") : fitsLeft ? "left" : "right";
        left =
          horizontal === "right"
            ? tr.right + gap
            : tr.left - gap - pr.width;
        top = tr.top + (tr.height - pr.height) / 2;
        top = Math.min(Math.max(MARGIN, top), vh - pr.height - MARGIN);
        left = Math.min(Math.max(MARGIN, left), vw - pr.width - MARGIN);
        if (top !== pos.top || left !== pos.left) setPos({ top, left });
        return;
      }

      const vertical: "bottom" | "top" =
        placement.startsWith("top")
          ? fitsAbove || !fitsBelow
            ? "top"
            : "bottom"
          : fitsBelow || !fitsAbove
            ? "bottom"
            : "top";

      const horizontal: "left" | "right" =
        placement.endsWith("Right")
          ? fitsRight || !fitsLeft
            ? "left"
            : "right"
          : fitsLeft || !fitsRight
            ? "left"
            : "right";

      if (vertical === "bottom") {
        top = tr.bottom + gap;
      } else {
        top = tr.top - gap - pr.height;
      }

      if (horizontal === "left") {
        // 与 trigger 左对齐（bottomLeft/topLeft）
        left = tr.left;
      } else {
        // 与 trigger 右对齐
        left = tr.right - pr.width;
      }

      // 夹紧到视口内
      top = Math.min(Math.max(MARGIN, top), vh - pr.height - MARGIN);
      left = Math.min(Math.max(MARGIN, left), vw - pr.width - MARGIN);

      if (top !== pos.top || left !== pos.left) {
        setPos({ top, left });
      }
    };

    const raf = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, placement, gap, triggerRef, popupRef, pos.top, pos.left]);

  return pos;
}

/** 浮层容器的固定定位样式 */
export function popupStyle(pos: PopupPosition, zIndex = 1000): CSSProperties {
  return {
    position: "fixed",
    top: pos.top,
    left: pos.left,
    zIndex,
    // 防止浮层自身撑开页面滚动
    maxWidth: `calc(100vw - ${MARGIN * 2}px)`,
  };
}

/** 将浮层渲染到 document.body（保持原有 className/内容不变） */
export function renderPopup(children: React.ReactNode): React.ReactNode {
  return createPortal(children, document.body);
}
