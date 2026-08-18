import { type ChangeEvent, type CSSProperties, type ReactNode, useRef, useState } from "react";
import clsx from "clsx";
import "./Upload.css";

export interface UploadFile {
  name: string;
  size: number;
  url?: string;
  status?: "uploading" | "done" | "error";
}

export interface UploadProps {
  action?: string;
  onUpload?: (file: File) => void;
  onSuccess?: (file: File, response: unknown) => void;
  onError?: (file: File, error: unknown) => void;
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function Upload({
  action,
  onUpload,
  onSuccess,
  onError,
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

  const uploadFile = async (file: File) => {
    // 本地状态：标记上传中
    setFiles((prev) => [...prev, { name: file.name, size: file.size, status: "uploading" }]);
    onUpload?.(file);

    if (!action) {
      // 无 action：仅本地展示
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name && f.size === file.size
            ? { ...f, status: "done" as const }
            : f
        )
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const resp = await fetch(action, { method: "POST", body: formData });
      const data = await resp.json().catch(() => null);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name && f.size === file.size
            ? { ...f, status: "done" as const, url: data?.url }
            : f
        )
      );
      onSuccess?.(file, data);
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name && f.size === file.size
            ? { ...f, status: "error" as const }
            : f
        )
      );
      onError?.(file, err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    selected.forEach(uploadFile);
    e.target.value = "";
  };

  const removeFile = (name: string, size: number) => {
    setFiles((prev) => prev.filter((f) => !(f.name === name && f.size === size)));
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
            <li key={`${f.name}-${i}`} className="pixel-upload-item">
              <span
                className={clsx(
                  "pixel-upload-item-name",
                  f.status === "error" && "pixel-upload-item-name--error"
                )}
              >
                {f.name}
              </span>
              {f.status === "uploading" && <span className="pixel-upload-status">…</span>}
              {f.status === "error" && <span className="pixel-upload-status">✕</span>}
              <button
                type="button"
                className="pixel-upload-remove"
                onClick={() => removeFile(f.name, f.size)}
                aria-label={`Remove ${f.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
