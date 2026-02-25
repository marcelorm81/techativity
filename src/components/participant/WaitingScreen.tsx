// WaitingScreen.tsx — Pong mini-game while waiting for next question
import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { hashToSeed } from '../../lib/blob-generator';

interface WaitingScreenProps {
  name: string;
  message?: string;
}

// Generate an imperfect shape path (wobbly rectangle for paddles, wobbly circle for ball)
function wobbleRect(
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number
): Path2D {
  const path = new Path2D();
  const rng = mulberry32(seed);
  const jitter = 2.5;
  const j = () => (rng() - 0.5) * jitter;

  // Go around the rectangle with slight offsets at corners and midpoints
  path.moveTo(x + j(), y + j());
  path.quadraticCurveTo(x + w * 0.5 + j(), y + j() * 0.5, x + w + j(), y + j());
  path.quadraticCurveTo(x + w + j() * 0.5, y + h * 0.5 + j(), x + w + j(), y + h + j());
  path.quadraticCurveTo(x + w * 0.5 + j(), y + h + j() * 0.5, x + j(), y + h + j());
  path.quadraticCurveTo(x + j() * 0.5, y + h * 0.5 + j(), x + j(), y + j());
  path.closePath();
  return path;
}

function wobbleCircle(cx: number, cy: number, r: number, seed: number): Path2D {
  const path = new Path2D();
  const rng = mulberry32(seed);
  const points = 10;
  const wobble = 0.18;

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const nextAngle = ((i + 1) / points) * Math.PI * 2;
    const rOff = r * (1 + (rng() - 0.5) * wobble);
    const px = cx + Math.cos(angle) * rOff;
    const py = cy + Math.sin(angle) * rOff;

    if (i === 0) {
      path.moveTo(px, py);
    } else {
      // Use a control point between current and next for organic curve
      const midAngle = (angle + nextAngle) * 0.5 - (Math.PI * 2) / points / 2;
      const cRoff = r * (1 + (rng() - 0.5) * wobble * 1.3);
      const cpx = cx + Math.cos(midAngle) * cRoff;
      const cpy = cy + Math.sin(midAngle) * cRoff;
      path.quadraticCurveTo(cpx, cpy, px, py);
    }
  }
  path.closePath();
  return path;
}

// Simple seeded PRNG
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Dashed center line with imperfect dashes
function drawCenterLine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number
) {
  const rng = mulberry32(seed + 999);
  ctx.save();
  ctx.strokeStyle = C.sageLight;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  const dashLen = 10;
  const gap = 8;
  let y = 4;
  while (y < h) {
    const x = w / 2 + (rng() - 0.5) * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rng() - 0.5) * 1, y + dashLen + (rng() - 0.5) * 2);
    ctx.stroke();
    y += dashLen + gap;
  }
  ctx.restore();
}

export default function WaitingScreen({
  name,
  message = 'Waiting for the next question\u2026',
}: WaitingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<ReturnType<typeof createGame> | null>(null);
  const animRef = useRef<number>(0);
  const [score, setScore] = useState({ left: 0, right: 0 });
  const nameSeed = hashToSeed(name);

  const createGame = useCallback(
    (w: number, h: number) => {
      const paddleW = 14;
      const paddleH = h * 0.22;
      const ballR = 8;
      const aiSpeed = 2.2;

      return {
        ball: { x: w / 2, y: h / 2, vx: 2.5, vy: 1.8 },
        left: { y: h / 2 - paddleH / 2 }, // player
        right: { y: h / 2 - paddleH / 2 }, // AI
        paddleW,
        paddleH,
        ballR,
        aiSpeed,
        w,
        h,
        shapeSeed: nameSeed,
        paused: false,
      };
    },
    [nameSeed]
  );

  // Touch / pointer control
  const pointerY = useRef<number | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerY.current = e.clientY - rect.top;
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerY.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const game = createGame(w, h);
    gameRef.current = game;

    let frameSeed = game.shapeSeed;

    function resetBall(direction: number) {
      game.ball.x = game.w / 2;
      game.ball.y = game.h / 2;
      game.ball.vx = 2.5 * direction;
      game.ball.vy = (Math.random() - 0.5) * 3;
      frameSeed += 1;
    }

    function update() {
      const { ball, left, right, paddleW, paddleH, ballR, aiSpeed } = game;

      // Player paddle follows pointer
      if (pointerY.current !== null) {
        const target = pointerY.current - paddleH / 2;
        left.y += (target - left.y) * 0.25;
      } else {
        // Auto-play when not touching (slightly imperfect)
        const targetY = ball.y - paddleH / 2 + Math.sin(Date.now() / 400) * 8;
        left.y += (targetY - left.y) * 0.06;
      }

      // AI paddle
      const aiTarget = ball.y - paddleH / 2 + Math.sin(Date.now() / 500) * 12;
      const aiDiff = aiTarget - right.y;
      right.y += Math.sign(aiDiff) * Math.min(Math.abs(aiDiff), aiSpeed);

      // Clamp paddles
      left.y = Math.max(0, Math.min(game.h - paddleH, left.y));
      right.y = Math.max(0, Math.min(game.h - paddleH, right.y));

      // Move ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Top/bottom bounce
      if (ball.y - ballR < 0) {
        ball.y = ballR;
        ball.vy *= -1;
      }
      if (ball.y + ballR > game.h) {
        ball.y = game.h - ballR;
        ball.vy *= -1;
      }

      // Left paddle collision
      if (
        ball.vx < 0 &&
        ball.x - ballR < paddleW + 10 &&
        ball.y > left.y &&
        ball.y < left.y + paddleH
      ) {
        ball.vx = Math.abs(ball.vx) * 1.03;
        ball.vy += ((ball.y - (left.y + paddleH / 2)) / paddleH) * 2;
        ball.x = paddleW + 10 + ballR;
        frameSeed += 1;
      }

      // Right paddle collision
      if (
        ball.vx > 0 &&
        ball.x + ballR > game.w - paddleW - 10 &&
        ball.y > right.y &&
        ball.y < right.y + paddleH
      ) {
        ball.vx = -Math.abs(ball.vx) * 1.03;
        ball.vy += ((ball.y - (right.y + paddleH / 2)) / paddleH) * 2;
        ball.x = game.w - paddleW - 10 - ballR;
        frameSeed += 1;
      }

      // Cap speed
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed > 6) {
        ball.vx = (ball.vx / speed) * 6;
        ball.vy = (ball.vy / speed) * 6;
      }

      // Score
      if (ball.x < -ballR) {
        setScore((s) => ({ ...s, right: s.right + 1 }));
        resetBall(1);
      }
      if (ball.x > game.w + ballR) {
        setScore((s) => ({ ...s, left: s.left + 1 }));
        resetBall(-1);
      }
    }

    function draw() {
      if (!ctx) return;
      const { ball, left, right, paddleW, paddleH, ballR } = game;

      // Clear
      ctx.clearRect(0, 0, game.w, game.h);

      // Center line
      drawCenterLine(ctx, game.w, game.h, game.shapeSeed);

      // Left paddle (player)
      ctx.fillStyle = C.sage;
      ctx.globalAlpha = 0.7;
      const leftPaddle = wobbleRect(10, left.y, paddleW, paddleH, frameSeed);
      ctx.fill(leftPaddle);

      // Right paddle (AI)
      ctx.fillStyle = C.sageDark;
      ctx.globalAlpha = 0.7;
      const rightPaddle = wobbleRect(
        game.w - paddleW - 10,
        right.y,
        paddleW,
        paddleH,
        frameSeed + 50
      );
      ctx.fill(rightPaddle);

      // Ball
      ctx.fillStyle = C.accentOlive;
      ctx.globalAlpha = 0.85;
      const ballShape = wobbleCircle(ball.x, ball.y, ballR, frameSeed + 100);
      ctx.fill(ballShape);

      ctx.globalAlpha = 1;
    }

    function loop() {
      update();
      draw();
      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [createGame]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: C.cream }}
    >
      <motion.div
        className="flex flex-col items-center w-full max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Greeting */}
        <h2
          style={{
            fontFamily: "'Gambarino', 'Georgia', serif",
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: C.darkText,
            textAlign: 'center',
            marginBottom: '0.3rem',
          }}
        >
          Hi, {name}
        </h2>

        {/* Waiting message */}
        <motion.p
          style={{
            fontFamily: "'Gambarino', 'Georgia', serif",
            fontSize: '0.8rem',
            color: C.midGray,
            textAlign: 'center',
            marginBottom: '1rem',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>

        {/* Score */}
        <div
          className="flex items-center gap-4 mb-2"
          style={{
            fontFamily: "'Gambarino', 'Georgia', serif",
            fontSize: '1.1rem',
            color: C.sage,
            letterSpacing: '0.1em',
          }}
        >
          <span>{score.left}</span>
          <span style={{ color: C.lightGray, fontSize: '0.7rem' }}>:</span>
          <span>{score.right}</span>
        </div>

        {/* Pong canvas */}
        <div
          className="w-full rounded-2xl overflow-hidden"
          style={{
            border: `1.5px solid ${C.sageLight}`,
            backgroundColor: C.warmWhite,
            aspectRatio: '4 / 3',
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ touchAction: 'none', cursor: 'none' }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          />
        </div>

        <p
          className="mt-2"
          style={{
            fontFamily: "'Gambarino', 'Georgia', serif",
            fontSize: '0.65rem',
            color: C.lightGray,
            textAlign: 'center',
          }}
        >
          drag to play
        </p>
      </motion.div>
    </div>
  );
}
