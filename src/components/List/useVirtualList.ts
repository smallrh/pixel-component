import { useMemo, useState, type UIEvent } from "react";

interface UseVirtualListOptions {
  itemCount: number;
  itemHeight: number;
  height: number;
  /** 额外渲染的项数，默认 5 */
  overscan?: number;
}

interface UseVirtualListResult {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  onScroll: (e: UIEvent<HTMLDivElement>) => void;
}

/**
 * 虚拟滚动 hook。基于固定行高计算可视区间，仅渲染 startIndex~endIndex 范围内的项。
 * totalHeight 撑开滚动条，offsetY 用 translateY 偏移渲染项以对齐滚动位置。
 */
export function useVirtualList({
  itemCount,
  itemHeight,
  height,
  overscan = 5,
}: UseVirtualListOptions): UseVirtualListResult {
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const { startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    const total = itemCount * itemHeight;
    const visibleCount = Math.ceil(height / itemHeight);
    const baseIndex = Math.floor(scrollTop / itemHeight);
    const start = Math.max(0, baseIndex - overscan);
    const end = Math.min(
      Math.max(0, itemCount - 1),
      baseIndex + visibleCount + overscan
    );
    return {
      startIndex: start,
      endIndex: end,
      totalHeight: total,
      offsetY: start * itemHeight,
    };
  }, [itemCount, itemHeight, height, overscan, scrollTop]);

  return { startIndex, endIndex, totalHeight, offsetY, onScroll };
}
