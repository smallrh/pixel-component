/**
 * 构建后清理脚本：移除 dist/types 下所有 .d.ts 中引用的 .css 文件（side-effect import）。
 *
 * 背景：组件源码含 `import "./Button.css"`，tsc 生成 .d.ts 时会原样保留该语句，
 * 但构建产物 dist/types 下并不复制 .css 文件，导致消费者在
 * `moduleResolution: "node16"` + `skipLibCheck: false` 下报 TS2882。
 *
 * 用法：node scripts/strip-css-imports.mjs [typesDir]
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const typesDir = resolve(process.argv[2] ?? "dist/types");
const cssImportRe = /^\s*import\s+["'][^"']+\.css["'];\s*$/gm;

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) entries.push(...walk(full));
    else if (full.endsWith(".d.ts")) entries.push(full);
  }
  return entries;
}

let removed = 0;
let touchedFiles = 0;

for (const file of walk(typesDir)) {
  const source = readFileSync(file, "utf8");
  const matches = source.match(cssImportRe);
  if (!matches) continue;
  const cleaned = source.replace(cssImportRe, "").replace(/\n{3,}/g, "\n\n");
  writeFileSync(file, cleaned);
  touchedFiles += 1;
  removed += matches.length;
  console.log(`[strip-css] ${file.replace(typesDir, "")}: removed ${matches.length} import(s)`);
}

console.log(`[strip-css] done: ${touchedFiles} file(s) touched, ${removed} css import(s) removed.`);
