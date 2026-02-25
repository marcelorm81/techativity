// blob-generator.ts — Organic shape generation for Techativity Live
// Ported from gen-blobs.js with additions for Q1/Q2/Q3 themed shapes

// ─── Seeded PRNG (Mulberry32) ───────────────────────────────────────
export function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Hash a string to a numeric seed
export function hashToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

// ─── Point types ────────────────────────────────────────────────────
interface Point {
  x: number;
  y: number;
}

export interface BlobOptions {
  seed?: number;
  points?: number;
  wobble?: number;
}

export interface LeafOptions {
  seed?: number;
  angle?: number;
}

export interface ShapeResult {
  path: string;
  transform?: string;
}

// ─── Core shape generators ──────────────────────────────────────────

/** Generate smooth organic blob path using perturbed circle with bezier curves */
export function blobPath(
  cx: number,
  cy: number,
  baseR: number,
  opts: BlobOptions = {}
): string {
  const rng = mulberry32(opts.seed || 42);
  const numPoints = opts.points || 8;
  const wobble = opts.wobble || 0.35;

  // Generate radii with smooth variation
  const radii: number[] = [];
  for (let i = 0; i < numPoints; i++) {
    const noise = 1 + (rng() - 0.5) * 2 * wobble;
    radii.push(baseR * noise);
  }

  // Smooth radii to avoid sharp transitions
  const smoothed = radii.map((r, i) => {
    const prev = radii[(i - 1 + numPoints) % numPoints];
    const next = radii[(i + 1) % numPoints];
    return r * 0.5 + prev * 0.25 + next * 0.25;
  });

  // Convert to cartesian points
  const pts: Point[] = smoothed.map((r, i) => {
    const angle = (i / numPoints) * Math.PI * 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  // Build smooth bezier path through points (Catmull-Rom → cubic bezier)
  let d = '';
  const tension = 0.3;
  for (let i = 0; i < pts.length; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % pts.length];
    const prev = pts[(i - 1 + pts.length) % pts.length];
    const nextNext = pts[(i + 2) % pts.length];

    const cp1x = curr.x + (next.x - prev.x) * tension;
    const cp1y = curr.y + (next.y - prev.y) * tension;
    const cp2x = next.x - (nextNext.x - curr.x) * tension;
    const cp2y = next.y - (nextNext.y - curr.y) * tension;

    if (i === 0) d += `M ${curr.x} ${curr.y} `;
    d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y} `;
  }
  d += 'Z';
  return d;
}

/** Generate a leaf/petal shape */
export function leafPath(
  cx: number,
  cy: number,
  w: number,
  h: number,
  opts: LeafOptions = {}
): ShapeResult {
  const angle = opts.angle || 0;
  const rng = mulberry32(opts.seed || 99);
  const skew = (rng() - 0.5) * 0.3;

  const topY = cy - h / 2;
  const botY = cy + h / 2;
  const midY = cy;
  const bulgeL = w * (0.5 + skew);
  const bulgeR = w * (0.5 - skew);

  let d = `M ${cx} ${topY} `;
  d += `C ${cx + bulgeR * 0.8} ${topY + h * 0.2}, ${cx + bulgeR} ${midY - h * 0.1}, ${cx + bulgeR * 0.6} ${midY} `;
  d += `C ${cx + bulgeR * 0.3} ${midY + h * 0.15}, ${cx + bulgeR * 0.5} ${botY - h * 0.15}, ${cx} ${botY} `;
  d += `C ${cx - bulgeL * 0.5} ${botY - h * 0.15}, ${cx - bulgeL * 0.3} ${midY + h * 0.15}, ${cx - bulgeL * 0.6} ${midY} `;
  d += `C ${cx - bulgeL} ${midY - h * 0.1}, ${cx - bulgeL * 0.8} ${topY + h * 0.2}, ${cx} ${topY} `;
  d += 'Z';

  return {
    path: d,
    transform: angle !== 0 ? `rotate(${angle} ${cx} ${cy})` : undefined,
  };
}

/** Generate an arc/crescent shape */
export function crescentPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  sweep: number
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const sa = toRad(startAngle);
  const ea = toRad(startAngle + sweep);

  const ox1 = cx + outerR * Math.cos(sa);
  const oy1 = cy + outerR * Math.sin(sa);
  const ox2 = cx + outerR * Math.cos(ea);
  const oy2 = cy + outerR * Math.sin(ea);
  const ix1 = cx + innerR * Math.cos(ea);
  const iy1 = cy + innerR * Math.sin(ea);
  const ix2 = cx + innerR * Math.cos(sa);
  const iy2 = cy + innerR * Math.sin(sa);

  const largeArc = sweep > 180 ? 1 : 0;

  let d = `M ${ox1} ${oy1} `;
  d += `A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2} `;
  d += `L ${ix1} ${iy1} `;
  d += `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} `;
  d += 'Z';
  return d;
}

// ─── Q&A Themed shapes ──────────────────────────────────────────────

/** Q1 (Identity): Bird-like silhouette — freedom, self-expression */
export function birdPath(
  cx: number,
  cy: number,
  size: number,
  opts: { seed?: number } = {}
): string {
  const rng = mulberry32(opts.seed || 200);
  const s = size;

  // Simplified bird in flight — body + two sweeping wings
  const bodyW = s * (0.15 + rng() * 0.05);
  const wingSpan = s * (0.9 + rng() * 0.2);
  const wingDip = s * (0.1 + rng() * 0.1);
  const wingLift = s * (0.25 + rng() * 0.15);

  // Body center
  const bx = cx, by = cy;

  // Left wing tip
  const lwx = cx - wingSpan / 2;
  const lwy = cy - wingLift + (rng() - 0.5) * wingDip;

  // Right wing tip
  const rwx = cx + wingSpan / 2;
  const rwy = cy - wingLift + (rng() - 0.5) * wingDip;

  // Tail
  const tx = cx;
  const ty = cy + s * 0.2;

  let d = `M ${tx} ${ty} `; // tail

  // Left wing — sweep up
  d += `C ${cx - bodyW} ${cy + s * 0.05}, ${cx - wingSpan * 0.3} ${cy + wingDip * 0.5}, ${lwx} ${lwy} `;

  // Left wing tip to head
  d += `C ${cx - wingSpan * 0.25} ${cy - wingLift * 0.7}, ${cx - bodyW * 1.5} ${cy - s * 0.15}, ${cx} ${cy - s * 0.12} `;

  // Head to right wing
  d += `C ${cx + bodyW * 1.5} ${cy - s * 0.15}, ${cx + wingSpan * 0.25} ${cy - wingLift * 0.7}, ${rwx} ${rwy} `;

  // Right wing back to tail
  d += `C ${cx + wingSpan * 0.3} ${cy + wingDip * 0.5}, ${cx + bodyW} ${cy + s * 0.05}, ${tx} ${ty} `;

  d += 'Z';
  return d;
}

/** Q2 (Reality): Smooth pebble/stone shape — grounded, heavy */
export function pebblePath(
  cx: number,
  cy: number,
  w: number,
  h: number,
  opts: { seed?: number } = {}
): string {
  const rng = mulberry32(opts.seed || 300);

  // Pebble: wider than tall, very smooth (low wobble, many points)
  const hw = w / 2;
  const hh = h / 2;
  const numPoints = 10;

  const pts: Point[] = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const rx = hw * (1 + (rng() - 0.5) * 0.15);
    const ry = hh * (1 + (rng() - 0.5) * 0.15);
    pts.push({
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
    });
  }

  // Smooth bezier through points
  const tension = 0.35;
  let d = '';
  for (let i = 0; i < pts.length; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % pts.length];
    const prev = pts[(i - 1 + pts.length) % pts.length];
    const nextNext = pts[(i + 2) % pts.length];

    const cp1x = curr.x + (next.x - prev.x) * tension;
    const cp1y = curr.y + (next.y - prev.y) * tension;
    const cp2x = next.x - (nextNext.x - curr.x) * tension;
    const cp2y = next.y - (nextNext.y - curr.y) * tension;

    if (i === 0) d += `M ${curr.x} ${curr.y} `;
    d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y} `;
  }
  d += 'Z';
  return d;
}

// ─── Shape theme selector ───────────────────────────────────────────

export type QuestionTheme = 'identity' | 'reality' | 'meaning' | 'clarity';

/** Generate a themed shape path for a Q&A answer blob */
export function themedShapePath(
  cx: number,
  cy: number,
  size: number,
  theme: QuestionTheme,
  seed: number
): ShapeResult {
  const rng = mulberry32(seed);

  switch (theme) {
    case 'identity': {
      // Bird silhouettes
      return { path: birdPath(cx, cy, size, { seed }) };
    }
    case 'reality': {
      // Pebble/stone shapes (wider than tall)
      const w = size * (0.9 + rng() * 0.3);
      const h = size * (0.6 + rng() * 0.2);
      return { path: pebblePath(cx, cy, w, h, { seed }) };
    }
    case 'meaning': {
      // Leaf/petal shapes
      const w = size * (0.5 + rng() * 0.2);
      const h = size * (0.9 + rng() * 0.3);
      const angle = (rng() - 0.5) * 40; // -20° to +20°
      return leafPath(cx, cy, w, h, { seed, angle });
    }
    case 'clarity': {
      // Organic blob — grounded, clear
      return { path: blobPath(cx, cy, size * 0.85, { seed, points: 8, wobble: 0.25 }) };
    }
  }
}

// ─── Decorative blob presets (matching PPTX blob placements) ────────

export const DECORATIVE_BLOBS = {
  title: (w: number, h: number) =>
    blobPath(w * 0.65, h * 0.5, Math.min(w, h) * 0.3, { seed: 11, points: 10, wobble: 0.3 }),
  sectionAccent: (w: number, h: number) =>
    blobPath(w * 0.5, h * 0.5, Math.min(w, h) * 0.35, { seed: 22, points: 7, wobble: 0.25 }),
  leaf: (cx: number, cy: number, size: number) =>
    leafPath(cx, cy, size * 0.4, size, { seed: 33, angle: -15 }),
  statement: (w: number, h: number) => [
    blobPath(w * 0.5, h * 0.5, Math.min(w, h) * 0.3, { seed: 44, points: 12, wobble: 0.35 }),
    blobPath(w * 0.6, h * 0.55, Math.min(w, h) * 0.18, { seed: 45, points: 8, wobble: 0.3 }),
  ],
  crescent: (cx: number, cy: number, r: number) =>
    crescentPath(cx, cy, r, r * 0.7, -30, 210),
  cluster: (w: number, h: number) => [
    blobPath(w * 0.22, h * 0.5, Math.min(w, h) * 0.15, { seed: 61, points: 7, wobble: 0.3 }),
    blobPath(w * 0.52, h * 0.5, Math.min(w, h) * 0.12, { seed: 62, points: 8, wobble: 0.25 }),
    blobPath(w * 0.78, h * 0.5, Math.min(w, h) * 0.13, { seed: 63, points: 9, wobble: 0.28 }),
  ],
  darkAccent: (w: number, h: number) =>
    blobPath(w * 0.5, h * 0.5, Math.min(w, h) * 0.38, { seed: 71, points: 9, wobble: 0.32 }),
  closing: (w: number, h: number) => [
    blobPath(w * 0.5, h * 0.5, Math.min(w, h) * 0.35, { seed: 81, points: 11, wobble: 0.28 }),
    blobPath(w * 0.42, h * 0.4, Math.min(w, h) * 0.13, { seed: 82, points: 7, wobble: 0.2 }),
  ],
  pebble: (cx: number, cy: number, r: number) =>
    blobPath(cx, cy, r, { seed: 91, points: 6, wobble: 0.2 }),
  wave: (w: number, h: number, seed = 111) => {
    const rng = mulberry32(seed);
    const topPts: Point[] = [];
    const botPts: Point[] = [];
    const nPts = 12;
    for (let i = 0; i <= nPts; i++) {
      const x = (i / nPts) * w;
      topPts.push({ x, y: h * 0.3 + (rng() - 0.5) * h * 0.2 });
      botPts.push({ x, y: h * 0.7 + (rng() - 0.5) * h * 0.2 });
    }
    let d = `M ${topPts[0].x} ${topPts[0].y} `;
    for (let i = 0; i < topPts.length - 1; i++) {
      const mx = (topPts[i].x + topPts[i + 1].x) / 2;
      d += `Q ${topPts[i].x + 20} ${topPts[i].y}, ${mx} ${(topPts[i].y + topPts[i + 1].y) / 2} `;
    }
    d += `L ${botPts[botPts.length - 1].x} ${botPts[botPts.length - 1].y} `;
    for (let i = botPts.length - 1; i > 0; i--) {
      const mx = (botPts[i].x + botPts[i - 1].x) / 2;
      d += `Q ${botPts[i].x - 20} ${botPts[i].y}, ${mx} ${(botPts[i].y + botPts[i - 1].y) / 2} `;
    }
    d += 'Z';
    return d;
  },
  tension: (w: number, h: number) =>
    blobPath(w * 0.5, h * 0.5, Math.min(w, h) * 0.38, { seed: 121, points: 6, wobble: 0.4 }),
} as const;
