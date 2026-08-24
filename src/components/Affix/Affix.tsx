import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import "./Affix.css";

export interface AffixProps {
  /** 距离视口顶部的固定偏移量，设置后将以顶部固定模式触发 */
  offsetTop?: number;
  /** 距离视口底部的固定偏移量，设置后将以底部固定模式触发 */
  offsetBottom?: number;
  /** 自定义附加类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 需要固钉包裹的内容 */
  children?: ReactNode;
}

/**
 * Affix 固钉。
 * 监听滚动将内容固定到视口顶部或底部，固钉时占位高度自动保持。
 */
export default function Affix({
  offsetTop,
  offsetBottom,
  className,
  style,
  children,
}: AffixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [affixed, setAffixed] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const shouldAffix =
        offsetTop !== undefined
          ? rect.top <= offsetTop
          : offsetBottom !== undefined
            ? window.innerHeight - rect.bottom <= offsetBottom
            : false;

      setAffixed(shouldAffix);
    };

    // Initial height
    setHeight(el.offsetHeight);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [offsetTop, offsetBottom]);

  return (
    <div
      ref={containerRef}
      className={clsx("pixel-affix", className)}
      style={{
        ...style,
        height: affixed ? height : undefined,
      }}
    >
      <div
        className={clsx("pixel-affix-inner", affixed && "pixel-affix-inner--fixed")}
        style={{
          top: offsetTop !== undefined ? offsetTop : undefined,
          bottom: offsetBottom !== undefined ? offsetBottom : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}