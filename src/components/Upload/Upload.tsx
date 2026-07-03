import { useRef, useState } from "react";
import clsx from "clsx";
import "./Upload.css";

interface UploadFile {
  name: string;
  size: number;
  url?: string;
}

interface UploadProps {
  onUpload?: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Upload({
  onUpload,
  accept,
  multiple = false,
  children,
  className,
  style,
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    selected.forEach((file) => {
      onUpload?.(file);
      setFiles((prev) => [
        ...prev,
        { name: file.name, size: file.size },
      ]);
    });
    e.target.value = "";
  };

  return (
    <div className={clsx("pixel-upload", className)} style={style}>
      <div className="pixel-upload-trigger" onClick={handleClick}>
        {children ?? (
          <div className="pixel-upload-placeholder">
            <span>+</span>
            <span>Upload</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {files.length > 0 && (
        <ul className="pixel-upload-list">
          {files.map((f, i) => (
            <li key={i} className="pixel-upload-item">
              {f.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}