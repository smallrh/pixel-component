import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import "./Affix.css";

export interface AffixProps {
  offsetTop?: number;
  offsetBottom?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

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