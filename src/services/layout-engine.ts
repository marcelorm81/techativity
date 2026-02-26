// layout-engine.ts — Force-directed blob garden layout
// Positions answer blobs with spring physics + collision repulsion
// Designed for 16:9 presentation space (~1920×1080 logical px)

export interface BlobNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetX: number;
  targetY: number;
}

export interface LayoutConfig {
  width: number;
  height: number;
  padding: number;
  /** Max radius for a single blob */
  maxRadius: number;
  /** Min radius when many blobs */
  minRadius: number;
  /** Spring stiffness toward target (0-1) */
  springK: number;
  /** Collision repulsion strength */
  repulsion: number;
  /** Velocity damping (0-1, lower = more friction) */
  damping: number;
  /** Center gravity strength */
  centerGravity: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
  width: 960,
  height: 500,
  padding: 20,
  maxRadius: 90,
  minRadius: 35,
  springK: 0.08,
  repulsion: 1.2,
  damping: 0.85,
  centerGravity: 0.005,
};

// ─── Radius scaling ──────────────────────────────────────────────────
// 5 size tiers create visual variety. Blobs only reach min-radius at ~18 items.

const SIZE_TIERS = [1.0, 0.86, 0.74, 0.64, 0.54];

/**
 * Compute an array of radii for `n` blobs, each assigned to one of 5 tiers.
 * The base radius scales gently so the current min-radius only appears at ~18 blobs.
 */
export function computeRadii(n: number, config: LayoutConfig = DEFAULT_CONFIG): number[] {
  if (n <= 0) return [];
  if (n === 1) return [config.maxRadius];

  // Gentle linear interpolation: full maxRadius at n=1, target floor at n=18
  const targetFloor = config.minRadius * 1.85;
  const t = Math.min(1, (n - 1) / 17);
  const baseRadius = config.maxRadius - (config.maxRadius - targetFloor) * t;

  const radii: number[] = [];
  for (let i = 0; i < n; i++) {
    const tier = SIZE_TIERS[i % SIZE_TIERS.length];
    const r = baseRadius * tier;
    radii.push(Math.max(config.minRadius, Math.min(config.maxRadius, r)));
  }
  return radii;
}

/** Legacy single-radius helper (returns the average tier radius) */
export function computeRadius(n: number, config: LayoutConfig = DEFAULT_CONFIG): number {
  if (n <= 0) return config.maxRadius;
  const radii = computeRadii(n, config);
  return radii[0]; // largest tier
}

// ─── Optimal target positions ────────────────────────────────────────
// Arrange blobs in a packed circular layout centered in the container

function goldenAngleTargets(
  n: number,
  cx: number,
  cy: number,
  radius: number,
  containerW: number,
  containerH: number,
  padding: number
): Array<{ x: number; y: number }> {
  if (n === 0) return [];
  if (n === 1) return [{ x: cx, y: cy }];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5°
  const targets: Array<{ x: number; y: number }> = [];

  // Elliptical spread — use full width and full height independently
  // so blobs fill the landscape container instead of clustering in the centre
  const maxSpreadX = containerW / 2 - radius - padding;
  const maxSpreadY = containerH / 2 - radius - padding;
  const normFactor = 1 / Math.sqrt(n);

  for (let i = 0; i < n; i++) {
    const r = Math.sqrt(i + 0.5) * normFactor;
    const theta = i * goldenAngle;
    const x = Math.max(radius + padding, Math.min(containerW - radius - padding,
      cx + maxSpreadX * r * Math.cos(theta)));
    const y = Math.max(radius + padding, Math.min(containerH - radius - padding,
      cy + maxSpreadY * r * Math.sin(theta)));
    targets.push({ x, y });
  }

  return targets;
}

// ─── Spawn position for new blobs ────────────────────────────────────

function randomEdgePosition(
  config: LayoutConfig,
  radius: number,
  seed: number
): { x: number; y: number } {
  // Deterministic spawn edge based on seed
  const edge = seed % 4;
  const t = (seed * 0.618033) % 1; // golden ratio distribution
  const p = config.padding + radius;

  switch (edge) {
    case 0: return { x: p + t * (config.width - 2 * p), y: p }; // top
    case 1: return { x: config.width - p, y: p + t * (config.height - 2 * p) }; // right
    case 2: return { x: p + t * (config.width - 2 * p), y: config.height - p }; // bottom
    default: return { x: p, y: p + t * (config.height - 2 * p) }; // left
  }
}

// ─── Physics simulation step ─────────────────────────────────────────

function simulateStep(nodes: BlobNode[], config: LayoutConfig): void {
  const cx = config.width / 2;
  const cy = config.height / 2;

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];

    // Spring toward target
    const dx = a.targetX - a.x;
    const dy = a.targetY - a.y;
    a.vx += dx * config.springK;
    a.vy += dy * config.springK;

    // Center gravity (gentle pull)
    a.vx += (cx - a.x) * config.centerGravity;
    a.vy += (cy - a.y) * config.centerGravity;

    // Collision repulsion with other blobs
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const ddx = a.x - b.x;
      const ddy = a.y - b.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
      const minDist = a.radius + b.radius + 1; // tight gap

      if (dist < minDist) {
        const overlap = (minDist - dist) / dist;
        const fx = ddx * overlap * config.repulsion;
        const fy = ddy * overlap * config.repulsion;
        a.vx += fx * 0.5;
        a.vy += fy * 0.5;
        b.vx -= fx * 0.5;
        b.vy -= fy * 0.5;
      }
    }

    // Damping
    a.vx *= config.damping;
    a.vy *= config.damping;
  }

  // Apply velocities + boundary clamping
  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;

    // Keep within bounds
    const minX = node.radius + config.padding;
    const maxX = config.width - node.radius - config.padding;
    const minY = node.radius + config.padding;
    const maxY = config.height - node.radius - config.padding;

    if (node.x < minX) { node.x = minX; node.vx *= -0.3; }
    if (node.x > maxX) { node.x = maxX; node.vx *= -0.3; }
    if (node.y < minY) { node.y = minY; node.vy *= -0.3; }
    if (node.y > maxY) { node.y = maxY; node.vy *= -0.3; }
  }
}

// ─── Main layout engine ──────────────────────────────────────────────

export class BlobLayoutEngine {
  private nodes: Map<string, BlobNode> = new Map();
  private config: LayoutConfig;
  private settled = false;

  constructor(config: Partial<LayoutConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  updateConfig(config: Partial<LayoutConfig>) {
    this.config = { ...this.config, ...config };
    this.recalculateTargets();
  }

  /** Add a new answer blob — returns the updated positions of ALL blobs */
  addBlob(id: string, seed: number): Map<string, BlobNode> {
    if (this.nodes.has(id)) return this.nodes;

    const n = this.nodes.size + 1;
    const radii = computeRadii(n, this.config);

    // Update all existing blob radii with new tiered sizes
    const existingIds = Array.from(this.nodes.keys());
    existingIds.forEach((existingId, i) => {
      const node = this.nodes.get(existingId)!;
      node.radius = radii[i];
    });

    // New blob gets the last radius in the array
    const newRadius = radii[n - 1];

    // Spawn new blob from edge
    const spawn = randomEdgePosition(this.config, newRadius, seed);
    const newNode: BlobNode = {
      id,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      radius: newRadius,
      targetX: spawn.x,
      targetY: spawn.y,
    };
    this.nodes.set(id, newNode);

    // Recalculate all target positions
    this.recalculateTargets();
    this.settled = false;

    return this.nodes;
  }

  /** Recalculate target positions for current blob count */
  private recalculateTargets() {
    const ids = Array.from(this.nodes.keys());
    const n = ids.length;
    if (n === 0) return;

    const radii = computeRadii(n, this.config);
    const maxR = Math.max(...radii);
    const cx = this.config.width / 2;
    const cy = this.config.height / 2;

    const targets = goldenAngleTargets(
      n, cx, cy, maxR,
      this.config.width, this.config.height,
      this.config.padding
    );

    ids.forEach((id, i) => {
      const node = this.nodes.get(id)!;
      node.radius = radii[i];
      node.targetX = targets[i].x;
      node.targetY = targets[i].y;
    });
  }

  /** Run one simulation step — call in requestAnimationFrame */
  step(): boolean {
    if (this.nodes.size === 0) return true;
    if (this.settled) return true;

    simulateStep(Array.from(this.nodes.values()), this.config);

    // Check if settled (all velocities near zero)
    let totalVelocity = 0;
    for (const node of this.nodes.values()) {
      totalVelocity += Math.abs(node.vx) + Math.abs(node.vy);
    }
    if (totalVelocity < 0.1 * this.nodes.size) {
      this.settled = true;
    }

    return this.settled;
  }

  /** Run multiple steps quickly (for initial layout) */
  settle(maxSteps = 120): void {
    for (let i = 0; i < maxSteps; i++) {
      if (this.step()) break;
    }
  }

  /** Get current snapshot of all node positions */
  getPositions(): BlobNode[] {
    return Array.from(this.nodes.values());
  }

  /** Get a single node by ID */
  getNode(id: string): BlobNode | undefined {
    return this.nodes.get(id);
  }

  /** Reset layout */
  clear() {
    this.nodes.clear();
    this.settled = false;
  }

  get size(): number {
    return this.nodes.size;
  }
}
