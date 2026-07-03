import clsx from "clsx";
import "./List.css";

interface ListItem {
  key: string;
  title: string;
  description?: string;
  avatar?: React.ReactNode;
  extra?: React.ReactNode;
}

interface ListProps {
  items: ListItem[];
  bordered?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function List({
  items,
  bordered = true,
  className,
  style,
}: ListProps) {
  return (
    <div
      className={clsx(
        "pixel-list",
        bordered && "pixel-list--bordered",
        className
      )}
      style={style}
    >
      {items.map((item) => (
        <div key={item.key} className="pixel-list-item">
          {item.avatar && <div className="pixel-list-item-avatar">{item.avatar}</div>}
          <div className="pixel-list-item-body">
            <div className="pixel-list-item-title">{item.title}</div>
            {item.description && (
              <div className="pixel-list-item-desc">{item.description}</div>
            )}
          </div>
          {item.extra && <div className="pixel-list-item-extra">{item.extra}</div>}
        </div>
      ))}
    </div>
  );
}