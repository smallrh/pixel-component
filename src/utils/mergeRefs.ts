import { type Ref } from "react";

/**
 * 合并多个 ref 到单个回调 ref。
 *
 * 用于同时把外部 forwardRef 与内部 useRef 指向同一 DOM 节点
 * （如 Modal 的 panelRef 既要驱动焦点陷阱，又要对外暴露 ref）。
 */
export function mergeRefs<T>(...refs: (Ref<T> | undefined | null)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}
