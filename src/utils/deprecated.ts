/**
 * 弃用警告（仅开发环境生效，去重不重复打印）。
 *
 * @param option.name        - 弃用的 API / Prop 名（必填）
 * @param option.alternative - 建议的替代方案（可选）
 * @param option.since       - 从哪个版本起弃用（可选）
 */
const _warnedKeys = new Set<string>();

type _ProcessEnv = { env?: { NODE_ENV?: string } };

function _getNodeEnv(): string | undefined {
  const g = globalThis as unknown as { process?: _ProcessEnv };
  return g.process?.env?.NODE_ENV;
}

function _isDevMode(): boolean {
  let viteDev = false;
  try {
    // vite/client 类型已提供 import.meta.env；用临时变量避免 terser 警告
    const metaEnv = import.meta.env;
    if (metaEnv && metaEnv.MODE === "development") {
      viteDev = true;
    }
  } catch {
    /* 非 Vite 环境下忽略 */
  }

  if (viteDev) return true;

  const nodeEnv = _getNodeEnv();
  if (nodeEnv !== undefined && nodeEnv !== "production") return true;

  return false;
}

export function deprecated(option: {
  name: string;
  alternative?: string;
  since?: string;
}): void {
  if (!_isDevMode()) return;

  const key = option.name;
  if (_warnedKeys.has(key)) return;
  _warnedKeys.add(key);

  const parts: string[] = [`[react-ui-pixel][DEPRECATED] "${option.name}" is deprecated.`];
  if (option.since) {
    parts.push(`(since ${option.since})`);
  }
  if (option.alternative) {
    parts.push(`Use "${option.alternative}" instead.`);
  }

  // eslint-disable-next-line no-console
  console.warn(parts.join(" "));
}
