/**
 * 构建后优化：把 dist 中 CSS 内联的 base64 字体提取为独立 .woff2 文件，
 * 并将 CSS 中的 data URI 替换为相对路径引用。
 *
 * 背景：Vite lib 模式会强制把 CSS 中引用的资源内联为 base64，
 * 导致 958KB 的全量样式里有约 670KB 是字体。提取后：
 *  - dist/react-ui-pixel.css：约 60-70KB
 *  - dist/assets/fonts/*.woff2：独立文件，浏览器按需加载且可缓存
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const dist = resolve(process.argv[2] ?? "dist");
const cssFile = join(dist, "react-ui-pixel.css");

const css = readFileSync(cssFile, "utf8");
const re = /url\(\s*data:font\/woff2;base64,([A-Za-z0-9+/=]+)\s*\)/g;

const outDir = join(dist, "assets", "fonts");
mkdirSync(outDir, { recursive: true });

const used = new Set();
let newCss = css;
let m;
let count = 0;

while ((m = re.exec(css)) !== null) {
  const data = m[1];
  const name = `font-${count}.woff2`;
  writeFileSync(join(outDir, name), Buffer.from(data, "base64"));
  used.add(name);
  newCss = newCss.replace(m[0], `url(./assets/fonts/${name})`);
  count += 1;
}

if (count === 0) {
  console.log("[extract-fonts] no base64 fonts found, nothing to do.");
  process.exit(0);
}

// 清理已合并到独立文件、但 CSS 已不再引用的旧字体名（避免重复产物）
writeFileSync(cssFile, newCss);

// 计算体积对比
const cssSize = Buffer.byteLength(newCss);
let fontSize = 0;
for (const name of used) {
  const p = join(outDir, name);
  fontSize += readFileSync(p).length;
}
console.log(
  `[extract-fonts] extracted ${count} font(s): CSS ${cssSize} bytes, fonts ${fontSize} bytes (was ${css.length}).`
);
