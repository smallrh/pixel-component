import { type ChangeEvent, type CSSProperties, type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import clsx from "clsx";
import "./Upload.css";

/** 上传文件描述 */
export interface UploadFile {
  /** 文件名 */
  name: string;
  /** 文件大小（字节） */
  size: number;
  /** 上传成功后的访问地址 */
  url?: string;
  /** 上传状态：上传中/完成/出错 */
  status?: "uploading" | "done" | "error";
}

export interface UploadProps {
  /** 上传接口地址；不传则仅本地展示 */
  action?: string;
  /** 文件开始上传回调 */
  onUpload?: (file: File) => void;
  /** 上传成功回调 */
  onSuccess?: (file: File, response: unknown) => void;
  /** 上传失败回调 */
  onError?: (file: File, error: unknown) => void;
  /** 接受的文件类型 */
  accept?: string;
  /** 是否支持多选，默认 false */
  multiple?: boolean;
  /** 自定义触发节点，缺省时展示默认占位 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
}

/**
 * Upload 上传。点击触发选择文件，按 action 上传并维护文件列表状态。
 * 关键特性：无 action 时仅本地展示；上传状态实时反映在列表项上。
 */
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
      <div
        className="pixel-upload-trigger"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
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
