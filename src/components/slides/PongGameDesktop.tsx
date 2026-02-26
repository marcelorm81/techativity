// PongGameDesktop.tsx — Landscape pong for the closing slide
// Transparent canvas — "thanks" and slide bg show through
// Player: bottom paddle, ←/→ arrows or mouse
// AI: top paddle, gets progressively harder over time

import { useRef, useEffect } from 'react';
import { SHAPES } from '../../lib/organic-shapes';

// Shapes that cycle on each player paddle hit (phone excluded — too narrow)
const BALL_SHAPES = [
  SHAPES.bird, SHAPES.cloud, SHAPES.sunBlob, SHAPES.man,
  SHAPES.sun, SHAPES.face, SHAPES.mountain,
] as const;

type OShape = typeof BALL_SHAPES[number];

/** Draw an organic SVG shape centred at (cx, cy), scaled to targetDiameter, rotated */
function drawBallShape(
  ctx: CanvasRenderingContext2D,
  shape: OShape,
  cx: number, cy: number,
  targetDiameter: number,
  rotation: number,
) {
  const scale = targetDiameter / Math.max(shape.width, shape.height);
  const hw = (shape.width  * scale) / 2;
  const hh = (shape.height * scale) / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.translate(-hw, -hh);
  ctx.scale(scale, scale);

  const path = new Path2D(shape.d);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  if ((shape as { fillRule?: string }).fillRule === 'evenodd') {
    ctx.fill(path, 'evenodd');
  } else {
    ctx.fill(path);
  }
  ctx.restore();
}

const PADDLE_T = 16;        // paddle thickness (px, logical)
const BALL_R   = 9;
const SPEED_BASE     = 4.5; // starting ball speed
const SPEED_PER_LVL  = 0.7; // added per difficulty level
const LEVEL_SECS     = 12;  // seconds between difficulty bumps
const MAX_SPEED      = 20;
const WIN_SCORE      = 7;
const KEY_SPEED      = 9;   // px per frame when arrow key held

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
}

export default function PongGameDesktop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const g = useRef({
    bx: 400, by: 225, bvx: 0, bvy: 0,
    px: 400, ax: 400,
    ps: 0, as: 0,
    w: 800, h: 450,
    mouseX: null as number | null,
    keys: { left: false, right: false },
    animId: 0,
    startTime: Date.now(),
    level: 0,
    shapeIndex: 0,   // cycles through BALL_SHAPES on each player hit
    rotation: 0,     // accumulated rotation in radians
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = g.current;
    const dpr = window.devicePixelRatio || 1;

    function ballSpeed() {
      return Math.min(SPEED_BASE + state.level * SPEED_PER_LVL, MAX_SPEED);
    }
    function aiLerp() {
      return Math.min(0.04 + state.level * 0.014, 0.22);
    }

    function resetBall() {
      const { w, h } = state;
      state.bx = w / 2;
      state.by = h / 2;
      const spd = ballSpeed();
      const angle = (Math.random() - 0.5) * 0.8;
      state.bvx = Math.sin(angle) * spd;
      state.bvy = (Math.random() > 0.5 ? 1 : -1) * Math.cos(angle) * spd;
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.px = state.w / 2;
      state.ax = state.w / 2;
      resetBall();
    }

    resize();
    state.startTime = Date.now();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);

    function loop() {
      const { w, h } = state;
      const pw     = w * 0.13;    // paddle width
      const playerY = h - 52;
      const aiY     = 52;

      // Difficulty level
      state.level = Math.floor((Date.now() - state.startTime) / 1000 / LEVEL_SECS);

      // Spin the ball — faster when the ball is moving fast
      const ballSpd = Math.sqrt(state.bvx ** 2 + state.bvy ** 2);
      state.rotation += ballSpd * 0.012;

      // ── Player paddle ──────────────────────────────────────────────
      if (state.keys.left)  state.px -= KEY_SPEED;
      if (state.keys.right) state.px += KEY_SPEED;
      if (state.mouseX !== null) {
        const rect = canvas!.getBoundingClientRect();
        const tx = state.mouseX - rect.left;
        state.px += (tx - state.px) * 0.2;
      }
      state.px = Math.max(pw / 2, Math.min(w - pw / 2, state.px));

      // ── AI paddle ──────────────────────────────────────────────────
      state.ax += (state.bx - state.ax) * aiLerp();
      state.ax = Math.max(pw / 2, Math.min(w - pw / 2, state.ax));

      // ── Ball movement ──────────────────────────────────────────────
      state.bx += state.bvx;
      state.by += state.bvy;

      // Wall bounces
      if (state.bx - BALL_R < 0) { state.bx = BALL_R; state.bvx *= -1; }
      if (state.bx + BALL_R > w) { state.bx = w - BALL_R; state.bvx *= -1; }

      // Player paddle (bottom)
      if (
        state.bvy > 0 &&
        state.by + BALL_R >= playerY - PADDLE_T / 2 &&
        state.by - BALL_R <= playerY + PADDLE_T / 2 &&
        Math.abs(state.bx - state.px) <= pw / 2 + BALL_R
      ) {
        state.by = playerY - PADDLE_T / 2 - BALL_R;
        const hit = (state.bx - state.px) / (pw / 2);
        const spd = Math.min(Math.sqrt(state.bvx ** 2 + state.bvy ** 2) * 1.05, MAX_SPEED);
        state.bvx = hit * spd * 0.7;
        state.bvy = -Math.sqrt(Math.max(spd * spd - state.bvx ** 2, spd * spd * 0.25));
        // Cycle to next organic shape on every player hit
        state.shapeIndex = (state.shapeIndex + 1) % BALL_SHAPES.length;
      }

      // AI paddle (top)
      if (
        state.bvy < 0 &&
        state.by - BALL_R <= aiY + PADDLE_T / 2 &&
        state.by + BALL_R >= aiY - PADDLE_T / 2 &&
        Math.abs(state.bx - state.ax) <= pw / 2 + BALL_R
      ) {
        state.by = aiY + PADDLE_T / 2 + BALL_R;
        const hit = (state.bx - state.ax) / (pw / 2);
        const spd = Math.min(Math.sqrt(state.bvx ** 2 + state.bvy ** 2) * 1.05, MAX_SPEED);
        state.bvx = hit * spd * 0.7;
        state.bvy = Math.sqrt(Math.max(spd * spd - state.bvx ** 2, spd * spd * 0.25));
      }

      // Scoring
      if (state.by - BALL_R > h) {
        state.as++;
        if (state.as >= WIN_SCORE) { state.as = 0; state.ps = 0; }
        resetBall();
      }
      if (state.by + BALL_R < 0) {
        state.ps++;
        if (state.ps >= WIN_SCORE) { state.ps = 0; state.as = 0; }
        resetBall();
      }

      // ── Draw ──────────────────────────────────────────────────────
      // Transparent — slide bg + "thanks" SVG show through
      ctx.clearRect(0, 0, w, h);

      // Center dashed divider
      ctx.save();
      ctx.setLineDash([10, 22]);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.restore();

      // Score numbers — corners so they don't cover the "thanks" SVG
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      const scoreFontSize = Math.round(h * 0.13);
      ctx.font = `${scoreFontSize}px 'Gambarino', Georgia, serif`;
      ctx.textBaseline = 'middle';
      // AI score — top-left
      ctx.textAlign = 'left';
      ctx.fillText(String(state.as), 28, h * 0.18);
      // Player score — bottom-right
      ctx.textAlign = 'right';
      ctx.fillText(String(state.ps), w - 28, h * 0.82);
      ctx.restore();

      // AI paddle (top, dim)
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      fillRoundRect(ctx, state.ax - pw / 2, aiY - PADDLE_T / 2, pw, PADDLE_T, 8);

      // Player paddle (bottom, bright)
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      fillRoundRect(ctx, state.px - pw / 2, playerY - PADDLE_T / 2, pw, PADDLE_T, 8);

      // Ball — organic shape, spinning, cycles on each player hit
      drawBallShape(
        ctx,
        BALL_SHAPES[state.shapeIndex],
        state.bx, state.by,
        BALL_R * 2.2,
        state.rotation,
      );

      state.animId = requestAnimationFrame(loop);
    }

    state.animId = requestAnimationFrame(loop);

    // Keyboard — capture arrows so slide nav doesn't fire while playing
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { state.keys.left  = true; e.preventDefault(); }
      if (e.key === 'ArrowRight') { state.keys.right = true; e.preventDefault(); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  state.keys.left  = false;
      if (e.key === 'ArrowRight') state.keys.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);

    return () => {
      cancelAnimationFrame(state.animId);
      resizeObs.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-20"
      style={{ touchAction: 'none' }}
      onPointerMove={(e) => { g.current.mouseX = e.clientX; }}
      onPointerLeave={() => { g.current.mouseX = null; }}
    />
  );
}
