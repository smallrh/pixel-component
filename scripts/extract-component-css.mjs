/**
 * 构建后处理：将每个组件独立的 CSS 文件复制到 dist/components/，
 * 支持消费者通过 sub-path 按需引入单个组件样式。
 *
 * 规则：
 *   src/components/Button/Button.css      -> dist/components/Button.css
 *   src/styles/global.css                 -> dist/components/global.css
 *
 * 失败时 process.exit(1)，成功时打印复制数量。
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, resolve, basename, dirname } from "node:path";

const projectRoot = resolve(process.cwd());
const srcComponentsDir = join(projectRoot, "src", "components");
const srcGlobalCss = join(projectRoot, "src", "styles", "global.css");
const distDir = join(projectRoot, "dist");
const distComponentsDir = join(distDir, "components");

// 确保 dist 目录存在（构建产物应该已经生成）
if (!existsSync(distDir)) {
  console.error("[extract-component-css] ERROR: dist/ directory not found. Run build:lib first.");
  process.exit(1);
}

// 检查 src/components 是否存在
if (!existsSync(srcComponentsDir)) {
  console.error("[extract-component-css] ERROR: src/components/ directory not found.");
  process.exit(1);
}

// 创建输出目录
mkdirSync(distComponentsDir, { recursive: true });

// 递归扫描目录的辅助函数
function walkDir(dir, callback) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

// 收集所有需要复制的 CSS：[源路径, 目标路径]
const copyList = [];

// 1. 扫描 src/components/**/*.css
// 规则：文件名为 <ComponentName>.css，且其所在目录也为 <ComponentName>/
// 例如 src/components/Button/Button.css -> Button.css
walkDir(srcComponentsDir, (filePath) => {
  if (!filePath.endsWith(".css")) return;

  const fileName = basename(filePath, ".css"); // e.g. "Button"
  const parentDirName = basename(dirname(filePath)); // e.g. "Button"

  // 只复制与目录同名的 CSS 文件（即组件主样式）
  if (fileName === parentDirName) {
    const destPath = join(distComponentsDir, `${fileName}.css`);
    copyList.push([filePath, destPath]);
  }
});

// 2. 复制 src/styles/global.css
if (existsSync(srcGlobalCss)) {
  copyList.push([srcGlobalCss, join(distComponentsDir, "global.css")]);
} else {
  console.error("[extract-component-css] ERROR: src/styles/global.css not found.");
  process.exit(1);
}

// 去重（理论上不会重复，但保险起见）
const seen = new Set();
const uniqueList = copyList.filter(([, dest]) => {
  if (seen.has(dest)) return false;
  seen.add(dest);
  return true;
});

// 执行复制
let copied = 0;
for (const [src, dest] of uniqueList) {
  try {
    copyFileSync(src, dest);
    copied += 1;
  } catch (err) {
    console.error(`[extract-component-css] ERROR: failed to copy ${src} -> ${dest}`);
    console.error(err.message);
    process.exit(1);
  }
}

console.log(`[extract-component-css] copied ${copied} CSS file(s) to dist/components/.`);
