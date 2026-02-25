// PongGame.tsx — Single-player pong for the post-answer waiting screen
// Player (bottom paddle) vs AI (top paddle), vertical orientation for mobile
import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';

const PADDLE_H = 14;
const BALL_R = 8;
const INITIAL_SPEED = 5.5;
const AI_LERP = 0.07;         // how fast AI tracks ball (0=frozen, 1=perfect)
const MAX_SPEED = 16;
const WIN_SCORE = 7;

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

export default function PongGame({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All mutable game state in a single ref — no re-renders during gameplay
  const g = useRef({
    bx: 200, by: 350,
    bvx: 2, bvy: -INITIAL_SPEED,
    px: 200,    // player paddle center x
    ax: 200,    // AI paddle center x
    ps: 0,      // player score
    as: 0,      // AI score
    w: 400, h: 700,
    touchX: null as number | null,
    animId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = g.current;
    const dpr = window.devicePixelRatio || 1;

    function resetBall() {
      const { w, h } = state;
      state.bx = w / 2;
      state.by = h / 2;
      const spd = INITIAL_SPEED;
      const angle = (Math.random() - 0.5) * 0.5;
      state.bvx = Math.sin(angle) * spd;
      state.bvy = (Math.random() > 0.5 ? 1 : -1) * Math.cos(angle) * spd;
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.px = state.w / 2;
      state.ax = state.w / 2;
      resetBall();
    }

    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);

    function loop() {
      const { w, h } = state;
      const pw = w * 0.38;
      const playerY = h - 60;
      const aiY = 60;

      // Move player paddle toward touch position
      if (state.touchX !== null) {
        const rect = canvas!.getBoundingClientRect();
        const tx = state.touchX - rect.left;
        state.px += (tx - state.px) * 0.25;
      }
      state.px = Math.max(pw / 2, Math.min(w - pw / 2, state.px));

      // AI tracks ball with slight delay
      state.ax += (state.bx - state.ax) * AI_LERP;
      state.ax = Math.max(pw / 2, Math.min(w - pw / 2, state.ax));

      // Move ball
      state.bx += state.bvx;
      state.by += state.bvy;

      // Wall bounce (left/right)
      if (state.bx - BALL_R < 0) { state.bx = BALL_R; state.bvx *= -1; }
      if (state.bx + BALL_R > w) { state.bx = w - BALL_R; state.bvx *= -1; }

      // Player paddle collision (bottom)
      if (
        state.bvy > 0 &&
        state.by + BALL_R >= playerY - PADDLE_H / 2 &&
        state.by - BALL_R <= playerY + PADDLE_H / 2 &&
        Math.abs(state.bx - state.px) <= pw / 2 + BALL_R
      ) {
        state.by = playerY - PADDLE_H / 2 - BALL_R;
        const hit = (state.bx - state.px) / (pw / 2);
        const spd = Math.min(Math.sqrt(state.bvx ** 2 + state.bvy ** 2) * 1.04, MAX_SPEED);
        state.bvx = hit * spd * 0.7;
        state.bvy = -Math.sqrt(Math.max(spd * spd - state.bvx ** 2, spd * spd * 0.25));
      }

      // AI paddle collision (top)
      if (
        state.bvy < 0 &&
        state.by - BALL_R <= aiY + PADDLE_H / 2 &&
        state.by + BALL_R >= aiY - PADDLE_H / 2 &&
        Math.abs(state.bx - state.ax) <= pw / 2 + BALL_R
      ) {
        state.by = aiY + PADDLE_H / 2 + BALL_R;
        const hit = (state.bx - state.ax) / (pw / 2);
        const spd = Math.min(Math.sqrt(state.bvx ** 2 + state.bvy ** 2) * 1.04, MAX_SPEED);
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

      // ─── Draw ───

      // Background
      ctx.fillStyle = C.olive;
      ctx.fillRect(0, 0, w, h);

      // Center dashed divider
      ctx.save();
      ctx.setLineDash([6, 12]);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.restore();

      // Scores — large faint background numbers
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = `${Math.round(w * 0.2)}px 'Gambarino', Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(state.as), w / 2, h * 0.34);  // AI score (top half)
      ctx.fillText(String(state.ps), w / 2, h * 0.66);  // Player score (bottom half)
      ctx.restore();

      // AI paddle (top, dimmer)
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      fillRoundRect(ctx, state.ax - pw / 2, aiY - PADDLE_H / 2, pw, PADDLE_H, 8);

      // Player paddle (bottom, brighter)
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      fillRoundRect(ctx, state.px - pw / 2, playerY - PADDLE_H / 2, pw, PADDLE_H, 8);

      // Ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(state.bx, state.by, BALL_R, 0, Math.PI * 2);
      ctx.fill();

      state.animId = requestAnimationFrame(loop);
    }

    state.animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(state.animId);
      resizeObs.disconnect();
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    g.current.touchX = e.clientX;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    g.current.touchX = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerUp = useCallback(() => {
    g.current.touchX = null;
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: C.olive }}
    >
      {/* Canvas fills everything */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ touchAction: 'none' }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />

      {/* Header overlay */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex flex-col items-center pt-9 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p style={{ fontFamily: F.title, fontSize: '1rem', color: C.white, opacity: 0.65 }}>
          Hi, {name}
        </p>
        <motion.p
          style={{ fontFamily: F.body, fontSize: '0.7rem', color: C.white, marginTop: '0.2rem' }}
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Waiting for the next question…
        </motion.p>
      </motion.div>

      {/* Footer hint */}
      <motion.p
        className="absolute bottom-5 left-0 right-0 text-center pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ fontFamily: F.body, fontSize: '0.6rem', color: C.white, opacity: 0.22 }}
      >
        drag to play
      </motion.p>
    </div>
  );
}
