import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import "./Anchor.css";

interface AnchorItem {
  key: string;
  href: string; // element id with #
  title: ReactNode;
  children?: AnchorItem[];
}

export interface AnchorProps {
  items: AnchorItem[];
  offsetTop?: number;
  className?: string;
  style?: CSSProperties;
}

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