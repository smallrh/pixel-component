import { useEffect, useRef, type RefObject } from "react";

/**
 * 焦点陷阱 hook（WCAG 2.4.3 焦点顺序）。
 *
 * - 打开时：聚焦到容器内第一个可聚焦元素
 * - 打开后：Tab / Shift+Tab 在容器内循环，不逃逸到背景
 * - 关闭时：焦点还原到打开前的元素
 *
 * 用法：
 * ```tsx
 * const panelRef = useFocusTrap(open);
 * return <div ref={panelRef}>...</div>;
 * ```
 *
 * @param open 是否激活焦点陷阱
 * @returns 应绑定到弹层容器的 ref
 */
export function useFocusTrap(open: boolean): RefObject<HTMLDivElement | null> {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    // 记录打开前的焦点元素，关闭时还原
    prevActiveRef.current = document.activeElement;

    const focusables = () =>
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
    const first = () => focusables()[0];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      // Shift+Tab 在第一个元素：阻止默认，聚焦末尾；Tab 在末尾元素：聚焦第一个
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    panel.addEventListener("keydown", handleKey);
    // 延迟聚焦第一个可聚焦元素（等 DOM 渲染完成）
    const t = window.setTimeout(() => first()?.focus(), 0);

    return () => {
      panel.removeEventListener("keydown", handleKey);
      window.clearTimeout(t);
      // 关闭时还原焦点到打开前的元素
      const prev = prevActiveRef.current;
      if (prev && document.contains(prev) && prev instanceof HTMLElement) {
        prev.focus();
      }
    };
  }, [open]);

  return panelRef;
}
