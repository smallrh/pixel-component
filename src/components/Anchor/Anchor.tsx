import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import "./Anchor.css";

interface AnchorItem {
  /** 锚点项唯一标识 */
  key: string;
  /** 锚点目标，形如 "#section-id" 的元素选择器 */
  href: string;
  /** 锚点显示文本 */
  title: ReactNode;
  /** 子级锚点，支持嵌套层级 */
  children?: AnchorItem[];
}

export interface AnchorProps {
  /** 锚点列表 */
  items: AnchorItem[];
  /** 距离视口顶部的偏移量（用于高亮计算与平滑滚动定位），默认 80 */
  offsetTop?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Anchor 锚点。用于页面滚动时高亮当前所在章节，点击平滑跳转至对应锚点。
 * 关键特性：监听 scroll 自动高亮；点击平滑滚动并锁定监听避免抖动；支持嵌套层级。
 */
export default function Anchor({
  items,
  offsetTop = 80,
  className,
  style,
}: AnchorProps) {
  const [activeKey, setActiveKey] = useState<string>("");
  const isScrolling = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      // Find the current heading in view
      const headings = items
        .map((item) => {
          const el = document.querySelector(item.href) as HTMLElement | null;
          return el ? { key: item.key, top: el.getBoundingClientRect().top } : null;
        })
        .filter(Boolean) as { key: string; top: number }[];

      const active = headings.reduce(
        (prev, curr) => (curr.top <= offsetTop && curr.top > prev.top ? curr : prev),
        { key: "", top: -Infinity }
      );

      if (active.key) {
        setActiveKey(active.key);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items, offsetTop]);

  const handleClick = (href: string) => {
    const el = document.querySelector(href) as HTMLElement | null;
    if (el) {
      isScrolling.current = true;
      const top = el.getBoundingClientRect().top + window.scrollY - offsetTop;
      window.scrollTo({ top, behavior: "smooth" });

      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };

  const renderItem = (item: AnchorItem, level = 0) => (
    <li key={item.key} className="pixel-anchor-item">
      <a
        className={clsx(
          "pixel-anchor-link",
          activeKey === item.key && "pixel-anchor-link--active"
        )}
        style={{ paddingLeft: 12 + level * 16 }}
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          handleClick(item.href);
        }}
      >
        <span className="pixel-anchor-marker" />
        {item.title}
      </a>
      {item.children && (
        <ul className="pixel-anchor-sublist">
          {item.children.map((child) => renderItem(child, level + 1))}
        </ul>
      )}
    </li>
  );

  return (
    <nav className={clsx("pixel-anchor", className)} style={style}>
      <ul className="pixel-anchor-list">{items.map((item) => renderItem(item))}</ul>
    </nav>
  );
}