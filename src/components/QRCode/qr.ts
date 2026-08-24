/**
 * 无依赖 QR 码编码器（ISO/IEC 18004 子集）。
 *
 * 支持：Version 1-10（21×21 ~ 57×57）、字节模式、纠错等级 L/M/Q/H、
 * 自动版本选择、8 种掩码惩罚评分。
 *
 * 之前 QRCode 组件只是基于 charCode 求和生成的装饰图案（不可扫描），
 * 本模块替换为真实 QR 编码：输出可被任意扫码器识别的矩阵。
 */

/* ================= GF(256) 与 Reed-Solomon ================= */

const EXP_TABLE: number[] = new Array(512);
const LOG_TABLE: number[] = new Array(256);

(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d; // 本原多项式 x^8 + x^4 + x^3 + x^2 + 1
  }
  for (let i = 255; i < 512; i++) EXP_TABLE[i] = EXP_TABLE[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}

/** GF(256) 多项式乘法（系数为降幂序：index 0 = 最高次） */
function gfPolyMul(p1: number[], p2: number[]): number[] {
  const coeff = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      coeff[i + j] ^= gfMul(p1[i], p2[j]);
    }
  }
  return coeff;
}

/** GF(256) 多项式长除求余（降幂序） */
function gfPolyMod(divident: number[], divisor: number[]): number[] {
  let result = divident.slice();
  while (result.length - divisor.length >= 0) {
    const coeff = result[0];
    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= gfMul(divisor[i], coeff);
    }
    let offset = 0;
    while (offset < result.length && result[offset] === 0) offset++;
    result = result.slice(offset);
  }
  return result;
}

/** 生成度为 degree 的 Reed-Solomon 生成多项式（降幂系数，首项为 1） */
function rsGeneratorPoly(degree: number): number[] {
  // 标准：g(x) = ∏_{i=0}^{degree-1} (x - α^i)，系数降幂
  let poly: number[] = [1];
  for (let i = 0; i < degree; i++) {
    poly = gfPolyMul(poly, [1, EXP_TABLE[i]]);
  }
  return poly;
}

/** 计算 data 的 RS 纠错码（长度为 degree） */
function rsEncode(data: number[], degree: number): number[] {
  const gen = rsGeneratorPoly(degree);
  const padded = [...data, ...new Array(degree).fill(0)];
  const rem = gfPolyMod(padded, gen);
  const out = new Array(degree).fill(0);
  out.splice(degree - rem.length, rem.length, ...rem);
  return out;
}

/* ================= 版本与纠错容量表 ================= */

type EccKey = "L" | "M" | "Q" | "H";

/** 每版本的尺寸（模块数） */
const VERSION_SIZE: Record<number, number> = {
  1: 21, 2: 25, 3: 29, 4: 33, 5: 37, 6: 41, 7: 45, 8: 49, 9: 53, 10: 57,
};

/** 每版本数据码字总数（byte 模式） */
const TOTAL_DATA_CODEWORDS: Record<number, Record<EccKey, number>> = {
  1: { L: 19, M: 16, Q: 13, H: 9 },
  2: { L: 34, M: 28, Q: 22, H: 16 },
  3: { L: 55, M: 44, Q: 34, H: 26 },
  4: { L: 80, M: 64, Q: 48, H: 36 },
  5: { L: 108, M: 86, Q: 62, H: 46 },
  6: { L: 136, M: 108, Q: 76, H: 60 },
  7: { L: 156, M: 124, Q: 88, H: 66 },
  8: { L: 194, M: 154, Q: 110, H: 86 },
  9: { L: 232, M: 182, Q: 132, H: 100 },
  10: { L: 274, M: 216, Q: 154, H: 122 },
};

/** 每块 ECC 码字数。多块结构按 [numBlocks, dataPerBlock, eccPerBlock] 表示 */
const BLOCK_STRUCTURE: Record<number, Record<EccKey, [number, number, number][]>> = {
  1: { L: [[1, 19, 7]], M: [[1, 16, 10]], Q: [[1, 13, 13]], H: [[1, 9, 17]] },
  2: { L: [[1, 34, 10]], M: [[1, 28, 16]], Q: [[1, 22, 22]], H: [[1, 16, 28]] },
  3: { L: [[1, 55, 15]], M: [[1, 44, 26]], Q: [[2, 17, 18]], H: [[2, 13, 22]] },
  4: { L: [[1, 80, 20]], M: [[2, 32, 18]], Q: [[2, 24, 26]], H: [[4, 9, 16]] },
  5: { L: [[1, 108, 26]], M: [[2, 43, 24]], Q: [[2, 15, 18], [2, 16, 18]], H: [[2, 11, 22], [2, 12, 22]] },
  6: { L: [[2, 68, 18]], M: [[4, 27, 16]], Q: [[4, 19, 24]], H: [[4, 15, 28]] },
  7: { L: [[2, 78, 20]], M: [[4, 31, 18]], Q: [[2, 14, 18], [4, 15, 18]], H: [[4, 13, 26], [1, 14, 26]] },
  8: { L: [[2, 97, 24]], M: [[2, 38, 22], [2, 39, 22]], Q: [[4, 18, 22], [2, 19, 22]], H: [[4, 14, 26], [2, 15, 26]] },
  9: { L: [[2, 116, 30]], M: [[3, 36, 22], [2, 37, 22]], Q: [[4, 16, 20], [4, 17, 20]], H: [[4, 12, 24], [4, 13, 24]] },
  10: { L: [[2, 68, 18], [2, 69, 18]], M: [[4, 43, 26], [1, 44, 26]], Q: [[6, 19, 24], [2, 20, 24]], H: [[6, 15, 28], [2, 16, 28]] },
};

/** Alignment pattern 中心坐标表（按版本） */
const ALIGNMENT_POSITIONS: Record<number, number[]> = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
  7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};

/** 纠错等级 → 格式信息 2bit 值 */
const ECC_BITS: Record<EccKey, number> = { L: 1, M: 0, Q: 3, H: 2 };

const MODE_BYTE = 0b0100;
const FORMAT_MASK = 0x5412;
const VERSION_POLY = 0x1f25; // G(x) for version info (BCH(18,6))

/** 字符数位宽：v1-9 为 8 位，v10-26 为 16 位 */
function charCountBits(version: number): number {
  return version <= 9 ? 8 : 16;
}

/* ================= 位缓冲 ================= */

class BitBuffer {
  bits: boolean[] = [];
  append(value: number, length: number) {
    for (let i = length - 1; i >= 0; i--) {
      this.bits.push(((value >>> i) & 1) === 1);
    }
  }
  getLength(): number {
    return this.bits.length;
  }
  getByte(i: number): number {
    let v = 0;
    for (let j = 0; j < 8; j++) v = (v << 1) | (this.bits[i * 8 + j] ? 1 : 0);
    return v;
  }
}

/* ================= 主流程 ================= */

function buildDataBits(text: string, version: number): BitBuffer {
  const buffer = new BitBuffer();
  // 依赖 TextEncoder（UTF-8 编码）。browserslist 目标浏览器（Chrome 38+/FF 19+/Safari 10.1+）原生支持，无需 polyfill。
  const bytes = new TextEncoder().encode(text);
  buffer.append(MODE_BYTE, 4);
  buffer.append(bytes.length, charCountBits(version));
  for (const b of bytes) buffer.append(b, 8);
  return buffer;
}

/** 将数据码字按块切分并补齐 */
function splitDataCodewords(
  data: number[],
  structure: [number, number, number][]
): number[][] {
  const blocks: number[][] = [];
  let idx = 0;
  for (const [numBlocks, dataPerBlock] of structure) {
    for (let b = 0; b < numBlocks; b++) {
      blocks.push(data.slice(idx, idx + dataPerBlock));
      idx += dataPerBlock;
    }
  }
  return blocks;
}

/** 数据码字与纠错码字交错排布 */
function interleave(
  dataBlocks: number[][],
  eccPerBlock: number
): { data: number[]; ecc: number[] } {
  const maxDataLen = Math.max(...dataBlocks.map((b) => b.length));
  const data: number[] = [];
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) data.push(block[i]);
    }
  }
  const ecc: number[] = [];
  for (let i = 0; i < eccPerBlock; i++) {
    for (const block of dataBlocks) {
      const eccBlock = rsEncode(block, eccPerBlock);
      ecc.push(eccBlock[i]);
    }
  }
  return { data, ecc };
}

/* ================= 矩阵构建 ================= */

function createMatrix(size: number): (0 | 1 | null)[][] {
  return Array.from({ length: size }, () => new Array<0 | 1 | null>(size).fill(null));
}

function setFunc(
  matrix: (0 | 1 | null)[][],
  row: number,
  col: number,
  value: 0 | 1
) {
  if (row >= 0 && row < matrix.length && col >= 0 && col < matrix.length) {
    matrix[row][col] = value;
  }
}

function drawFinder(matrix: (0 | 1 | null)[][], row: number, col: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      if (row + r < 0 || row + r >= matrix.length || col + c < 0 || col + c >= matrix.length) continue;
      const inRing = r >= 0 && r <= 6 && c >= 0 && c <= 6;
      const center = inRing && (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      const dark = r === 0 || r === 6 || c === 0 || c === 6 || center;
      if (inRing) matrix[row + r][col + c] = dark ? 1 : 0;
      else matrix[row + r][col + c] = 0; // separator
    }
  }
}

function drawAlignment(matrix: (0 | 1 | null)[][], row: number, col: number) {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const dark = Math.max(Math.abs(r), Math.abs(c)) !== 1;
      setFunc(matrix, row + r, col + c, dark ? 1 : 0);
    }
  }
}

/** 计算 format info 的 15 位（BCH(15,5) + 掩码 0x5412） */
function formatInfo(eccBits: number, mask: number): number {
  const data = (eccBits << 3) | mask;
  let rem = data << 10;
  for (let i = 14; i >= 10; i--) {
    if (((rem >> i) & 1) === 1) rem ^= 0x537 << (i - 10);
  }
  return ((data << 10) | rem) ^ FORMAT_MASK;
}

/** 计算 version info 的 18 位（BCH(18,6)，v7 及以上） */
function versionInfo(version: number): number {
  let rem = version << 12;
  for (let i = 17; i >= 12; i--) {
    if (((rem >> i) & 1) === 1) rem ^= VERSION_POLY << (i - 12);
  }
  return (version << 12) | rem;
}

/** ISO/IEC 18004 标准 8 种数据掩码（编号 0-7 与 format info 一致） */
const MASK_FUNCTIONS: ((i: number, j: number) => boolean)[] = [
  (i, j) => (i + j) % 2 === 0,
  (i, _j) => i % 2 === 0,
  (_i, j) => j % 3 === 0,
  (i, j) => (i + j) % 3 === 0,
  (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0,
  (i, j) => ((i * j) % 2) + ((i * j) % 3) === 0,
  (i, j) => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  (i, j) => (((i * j) % 3) + ((i + j) % 2)) % 2 === 0,
];

/** 掩码惩罚分（4 条规则） */
function maskPenalty(matrix: (0 | 1)[][]): number {
  const size = matrix.length;
  let score = 0;

  // 规则 1：行/列中 5+ 连续同色
  for (let r = 0; r < size; r++) {
    let runLen = 1;
    for (let c = 1; c <= size; c++) {
      if (c < size && matrix[r][c] === matrix[r][c - 1]) runLen++;
      else {
        if (runLen >= 5) score += 3 + (runLen - 5);
        runLen = 1;
      }
    }
  }
  for (let c = 0; c < size; c++) {
    let runLen = 1;
    for (let r = 1; r <= size; r++) {
      if (r < size && matrix[r][c] === matrix[r - 1][c]) runLen++;
      else {
        if (runLen >= 5) score += 3 + (runLen - 5);
        runLen = 1;
      }
    }
  }

  // 规则 2：2×2 同色块
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = matrix[r][c];
      if (matrix[r][c + 1] === v && matrix[r + 1][c] === v && matrix[r + 1][c + 1] === v) {
        score += 3;
      }
    }
  }

  // 规则 3：1:1:3:1:1 图案（1011101）前后 4 个 0
  const pattern3 = (line: number[]): number => {
    let s = 0;
    for (let i = 0; i <= line.length - 11; i++) {
      const seg = line.slice(i, i + 11);
      const p1 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
      const p2 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
      if (seg.every((v, k) => v === p1[k])) s += 40;
      if (seg.every((v, k) => v === p2[k])) s += 40;
    }
    return s;
  };
  for (let r = 0; r < size; r++) score += pattern3(matrix[r]);
  for (let c = 0; c < size; c++) {
    const col = matrix.map((row) => row[c]);
    score += pattern3(col);
  }

  // 规则 4：暗模块比例
  let dark = 0;
  for (const row of matrix) for (const v of row) if (v === 1) dark++;
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

/**
 * 生成二维码矩阵。
 * @param text 编码内容（UTF-8 字节模式）
 * @param ecc 纠错等级，默认 M
 * @param maskOverride 指定掩码 0-7（默认自动选择最优掩码；主要用于测试）
 * @returns boolean[row][col] 矩阵（true=暗模块）
 */
export function generateQRCodeMatrix(
  text: string,
  ecc: EccKey = "M",
  maskOverride?: number
): boolean[][] {
  if (!text) throw new Error("QRCode: value must not be empty");

  // 1. 选择版本：最小满足数据容量的版本
  let version = 1;
  // 依赖 TextEncoder（UTF-8 编码）。browserslist 目标浏览器（Chrome 38+/FF 19+/Safari 10.1+）原生支持，无需 polyfill。
  const bytes = new TextEncoder().encode(text);
  for (; version <= 10; version++) {
    const bits = 4 + charCountBits(version) + bytes.length * 8;
    const capacityBits = TOTAL_DATA_CODEWORDS[version][ecc] * 8;
    if (bits <= capacityBits) break;
  }
  if (version > 10) {
    throw new Error("QRCode: value too long for version 1-10");
  }

  const size = VERSION_SIZE[version];
  const structure = BLOCK_STRUCTURE[version][ecc];

  // 2. 数据位流 → 码字（补 terminator、对齐、填充）
  const dataBuffer = buildDataBits(text, version);
  const totalDataCodewords = TOTAL_DATA_CODEWORDS[version][ecc];
  let totalBits = dataBuffer.getLength();
  const capacityBits = totalDataCodewords * 8;
  const terminator = Math.min(4, capacityBits - totalBits);
  for (let i = 0; i < terminator; i++) dataBuffer.bits.push(false);
  totalBits = dataBuffer.getLength();
  while (totalBits % 8 !== 0) {
    dataBuffer.bits.push(false);
    totalBits++;
  }
  const dataCodewords: number[] = [];
  for (let i = 0; i < totalDataCodewords; i++) {
    dataCodewords.push(dataBuffer.getByte(i));
  }
  // 填充码字 0xEC / 0x11 交替（标准：从 0xEC 开始）
  let padIdx = 0;
  for (let i = Math.ceil(totalBits / 8); i < totalDataCodewords; i++) {
    dataCodewords[i] = padIdx % 2 === 0 ? 0xec : 0x11;
    padIdx++;
  }

  // 3. 分块 + RS 纠错 + 交错
  const dataBlocks = splitDataCodewords(dataCodewords, structure);
  const eccPerBlock = structure[0][2];
  const { data: interleavedData, ecc: interleavedEcc } = interleave(dataBlocks, eccPerBlock);

  // 4. 构建矩阵（功能图案）
  const matrix = createMatrix(size);

  drawFinder(matrix, 0, 0);
  drawFinder(matrix, size - 7, 0);
  drawFinder(matrix, 0, size - 7);

  // timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0 ? 1 : 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // alignment patterns
  const positions = ALIGNMENT_POSITIONS[version];
  if (positions.length > 0) {
    for (const r of positions) {
      for (const c of positions) {
        // 跳过与三个 finder 重叠的位置
        const overlaps =
          (r === 6 && c === 6) ||
          (r === 6 && c === size - 7) ||
          (r === size - 7 && c === 6);
        if (!overlaps) drawAlignment(matrix, r, c);
      }
    }
  }

  // dark module
  setFunc(matrix, size - 8, 8, 1);

  // 5. 数据放置（之字形，从右下角）
  const moduleStream: (0 | 1)[] = [...interleavedData, ...interleavedEcc]
    .flatMap((byte) =>
      Array.from({ length: 8 }, (_, k) => ((byte >>> (7 - k)) & 1) as 0 | 1)
    );

  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // 跳过 timing 列
    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i;
      for (let c = 0; c < 2; c++) {
        const col2 = col - c;
        // 跳过已填充的功能图案与 format/version 信息预留区域
        if (matrix[row][col2] !== null || isFunctionModule(version, row, col2)) continue;
        matrix[row][col2] = bitIdx < moduleStream.length ? moduleStream[bitIdx] : 0;
        bitIdx++;
      }
    }
    upward = !upward;
  }

  // 6. 选择最优掩码（或使用指定掩码）
  const candidates: ((0 | 1)[][] | null)[] = MASK_FUNCTIONS.map((_, maskIdx) => {
    if (maskOverride !== undefined && maskIdx !== maskOverride) return null;
    const m = matrix.map((row) => row.map((v) => (v === null ? 0 : v)) as (0 | 1)[]);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!isFunctionModule(version, r, c)) {
          if (MASK_FUNCTIONS[maskIdx](r, c)) m[r][c] = m[r][c] === 1 ? 0 : 1;
        }
      }
    }
    // 写入 format info（15 位，LSB-first，布局与标准扫码器一致）
    const bits15 = formatInfo(ECC_BITS[ecc], maskIdx);
    // 副本1：垂直列 col=8（左上 finder 旁 + 左下角）
    for (let i = 0; i < 15; i++) {
      const mod = ((bits15 >> i) & 1) as 0 | 1;
      if (i < 6) m[i][8] = mod;
      else if (i < 8) m[i + 1][8] = mod;
      else m[size - 15 + i][8] = mod;
    }
    // 副本2：水平行 row=8（LSB-first，与 ISO 18004 / 主流实现一致）
    // 位 0-7 → (8,size-1)..(8,size-8)；位 8 → (8,7)；位 9-14 → (8,5)..(8,0)
    for (let i = 0; i < 15; i++) {
      const mod = ((bits15 >> i) & 1) as 0 | 1;
      if (i < 8) m[8][size - 1 - i] = mod;
      else if (i === 8) m[8][7] = mod;
      else m[8][14 - i] = mod;
    }
    // 写入 version info（v7+，18 位，LSB-first）
    if (version >= 7) {
      const bits18 = versionInfo(version);
      const colBase = size - 11;
      for (let i = 0; i < 18; i++) {
        const bit = ((bits18 >> i) & 1) as 0 | 1;
        m[Math.floor(i / 3)][colBase + (i % 3)] = bit;
        m[colBase + (i % 3)][Math.floor(i / 3)] = bit;
      }
    }
    return m;
  });

  // 惩罚分排序，选最优（maskOverride 时直接取该掩码）
  const validCandidates = candidates.filter((c): c is (0 | 1)[][] => c !== null);
  let bestMask = validCandidates[0];
  let bestScore = Infinity;
  for (const cand of validCandidates) {
    const s = maskPenalty(cand);
    if (s < bestScore) {
      bestScore = s;
      bestMask = cand;
    }
  }

  return bestMask.map((row) => row.map((v) => v === 1));
}

/** 判断某模块是否为功能模块（不被掩码/数据覆盖） */
function isFunctionModule(version: number, row: number, col: number): boolean {
  const size = VERSION_SIZE[version];

  // finder + separator
  if (row < 9 && col < 9) return true;
  if (row < 9 && col >= size - 8) return true;
  if (row >= size - 8 && col < 9) return true;

  // timing
  if (row === 6 || col === 6) return true;

  // alignment patterns（排除与 finder 重叠）
  const positions = ALIGNMENT_POSITIONS[version];
  for (const r of positions) {
    for (const c of positions) {
      const overlaps = (r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6);
      if (overlaps) continue;
      if (Math.abs(row - r) <= 2 && Math.abs(col - c) <= 2) return true;
    }
  }

  // dark module
  if (row === size - 8 && col === 8) return true;

  // format info 副本1：垂直 col=8（(0..5,8),(7,8),(8,8),(size-7..size-1,8)）
  if (col === 8 && (row <= 5 || row === 7 || row === 8 || row >= size - 7)) return true;
  // format info 副本2：水平 row=8（(8,size-1..size-8),(8,7),(8,5..0)）
  if (row === 8 && (col >= size - 8 || col === 7 || col <= 5)) return true;

  // version info（v7+）
  if (version >= 7 && row < 6 && col >= size - 11) return true;
  if (version >= 7 && col < 6 && row >= size - 11) return true;

  return false;
}
