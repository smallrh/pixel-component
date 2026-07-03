import clsx from "clsx";
import "./Avatar.css";

interface AvatarProps {
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export default function Avatar({
  children,
  src,
  alt = "",
  size = "md",
  className,
  style,
}: AvatarProps) {
  const sizeMap = { sm: 24, md: 32, lg: 48 };

  return (
    <span
      className={clsx("pixel-avatar", `pixel-avatar--${size}`, className)}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        ...style,
      }}
    >
      {src ? (
        <img className="pixel-avatar-img" src={src} alt={alt} />
      ) : (
        <span className="pixel-avatar-text">{children}</span>
      )}
    </span>
  );
}