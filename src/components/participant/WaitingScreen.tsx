// WaitingScreen.tsx — Interactive shape generator: tap to spawn floating organic shapes
import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { SHAPES, SHAPE_KEYS } from '../../lib/organic-shapes';
import type { OrganicShape } from '../../lib/organic-shapes';

interface WaitingScreenProps {
  name: string;
  message?: string;
}

// ─── Physics shape type ──────────────────────────────────────────────

interface FloatingShape {
  id: number;
  shape: OrganicShape;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  fill: string;
  opacity: number;
}

// ─── Color palette for spawned shapes ────────────────────────────────

const SHAPE_FILLS = [
  C.white,
  'rgba(255,255,255,0.85)',
  'rgba(255,255,255,0.7)',
  'rgba(255,255,255,0.9)',
  'rgba(255,255,255,0.75)',
  'rgba(255,255,255,0.8)',
];

const MAX_SHAPES = 40; // When this many shapes are on screen, reload

export default function WaitingScreen({
  name,
  message = 'Waiting for the next question\u2026',
}: WaitingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<FloatingShape[]>([]);
  const nextIdRef = useRef(0);
  const animRef = useRef<number>(0);
  const [shapeCount, setShapeCount] = useState(0);
  const [reloading, setReloading] = useState(false);

  // Draw a single shape on canvas using Path2D
  const drawShapeOnCanvas = useCallback(
    (ctx: CanvasRenderingContext2D, shape: FloatingShape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      const s = shape.scale;
      ctx.scale(s, s);
      ctx.translate(-shape.shape.width / 2, -shape.shape.height / 2);

      const path = new Path2D(shape.shape.d);
      ctx.fillStyle = shape.fill;
      ctx.globalAlpha = shape.opacity;
      if (shape.shape.fillRule === 'evenodd') {
        ctx.fill(path, 'evenodd');
      } else {
        ctx.fill(path);
      }
      ctx.restore();
    },
    []
  );

  // Spawn a shape at given position
  const spawnShape = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || reloading) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const shapeKey = SHAPE_KEYS[nextIdRef.current % SHAPE_KEYS.length];
    const shape = SHAPES[shapeKey];
    const fill = SHAPE_FILLS[nextIdRef.current % SHAPE_FILLS.length];

    // Random velocity in a random direction
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.5;

    const newShape: FloatingShape = {
      id: nextIdRef.current++,
      shape,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      scale: 0.08 + Math.random() * 0.12,
      fill,
      opacity: 0.15 + Math.random() * 0.25,
    };

    shapesRef.current.push(newShape);
    setShapeCount(shapesRef.current.length);

    // Check if full — trigger reload
    if (shapesRef.current.length >= MAX_SHAPES) {
      setReloading(true);
      setTimeout(() => {
        shapesRef.current = [];
        setShapeCount(0);
        setReloading(false);
      }, 600);
    }
  }, [reloading]);

  // Handle tap/click
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    spawnShape(e.clientX, e.clientY);
  }, [spawnShape]);

  // Physics + render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);

    function loop() {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Clear
      ctx.clearRect(0, 0, w, h);

      const shapes = shapesRef.current;

      // Physics step
      for (const s of shapes) {
        // Move
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;

        // Gentle gravity toward center
        const cx = w / 2;
        const cy = h / 2;
        s.vx += (cx - s.x) * 0.0001;
        s.vy += (cy - s.y) * 0.0001;

        // Damping
        s.vx *= 0.998;
        s.vy *= 0.998;

        // Bounce off walls
        const margin = 20;
        if (s.x < margin) { s.x = margin; s.vx *= -0.5; }
        if (s.x > w - margin) { s.x = w - margin; s.vx *= -0.5; }
        if (s.y < margin) { s.y = margin; s.vy *= -0.5; }
        if (s.y > h - margin) { s.y = h - margin; s.vy *= -0.5; }
      }

      // Collision between shapes (simple push apart)
      for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const a = shapes[i];
          const b = shapes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = (a.scale + b.scale) * 150;

          if (dist < minDist) {
            const overlap = (minDist - dist) / dist * 0.3;
            a.vx += dx * overlap * 0.02;
            a.vy += dy * overlap * 0.02;
            b.vx -= dx * overlap * 0.02;
            b.vy -= dy * overlap * 0.02;
          }
        }
      }

      // Draw all shapes
      for (const s of shapes) {
        drawShapeOnCanvas(ctx, s);
      }

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObs.disconnect();
    };
  }, [drawShapeOnCanvas]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: C.olive }}
    >
      {/* Canvas for shapes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none', cursor: 'crosshair' }}
        onPointerDown={handlePointerDown}
      />

      {/* Reload flash overlay */}
      <AnimatePresence>
        {reloading && (
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: C.olive, zIndex: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Content overlay */}
      <motion.div
        className="relative flex flex-col items-center text-center pointer-events-none"
        style={{ zIndex: 10 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontFamily: F.title,
            fontSize: '1.4rem',
            fontWeight: 400,
            color: C.white,
            textAlign: 'center',
            marginBottom: '0.3rem',
          }}
        >
          Hi, {name}
        </h2>

        <motion.p
          style={{
            fontFamily: F.body,
            fontSize: '0.85rem',
            color: C.white,
            textAlign: 'center',
            opacity: 0.5,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>

        <p
          className="mt-4"
          style={{
            fontFamily: F.body,
            fontSize: '0.7rem',
            color: C.white,
            opacity: 0.3,
          }}
        >
          tap to create shapes {'\u00B7'} {shapeCount}/{MAX_SHAPES}
        </p>
      </motion.div>
    </div>
  );
}
