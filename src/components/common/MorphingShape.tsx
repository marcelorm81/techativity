// MorphingShape.tsx — Organic SVG shape that morphs between hand-drawn forms
// Uses flubber for smooth path interpolation + framer motion for float/drift
import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { interpolate } from 'flubber';
import { C } from '../../lib/design-system';
import type { OrganicShape } from '../../lib/organic-shapes';
import { MORPH_CYCLE } from '../../lib/organic-shapes';

export interface MorphingShapeProps {
  /** Shape(s) to display. If array, morphs between them in order. */
  shapes?: OrganicShape[];
  /** Single static shape (shorthand) */
  shape?: OrganicShape;
  /** Fill color */
  fill?: string;
  /** Stroke color (optional, for hand-drawn outline effect) */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Opacity */
  opacity?: number;
  /** Enable morphing between shapes (default: true if shapes.length > 1) */
  morph?: boolean;
  /** Morph cycle duration in seconds per transition (default: 8) */
  morphDuration?: number;
  /** Enable floating animation */
  float?: boolean;
  /** Float amplitude in px (default: 5) */
  floatAmp?: number;
  /** Float duration in seconds (default: 7) */
  floatDuration?: number;
  /** Enable slow rotation */
  rotate?: boolean;
  /** Rotation range in degrees (default: 3) */
  rotateRange?: number;
  /** Phase offset (0-1) for staggering multiple shapes */
  phase?: number;
  /** CSS class for the wrapper */
  className?: string;
  /** Style overrides for positioning */
  style?: React.CSSProperties;
}

export default function MorphingShape({
  shapes,
  shape,
  fill = C.sage,
  stroke,
  strokeWidth = 0,
  opacity = 1,
  morph = true,
  morphDuration = 8,
  float: enableFloat = true,
  floatAmp = 5,
  floatDuration = 7,
  rotate = true,
  rotateRange = 3,
  phase = 0,
  className = '',
  style,
}: MorphingShapeProps) {
  // Resolve the shape list
  const shapeList = useMemo(() => {
    if (shapes && shapes.length > 0) return shapes;
    if (shape) return [shape];
    return MORPH_CYCLE;
  }, [shapes, shape]);

  const shouldMorph = morph && shapeList.length > 1;

  // Build interpolators between consecutive shapes
  const interpolators = useMemo(() => {
    if (!shouldMorph) return [];
    return shapeList.map((s, i) => {
      const next = shapeList[(i + 1) % shapeList.length];
      return interpolate(s.d, next.d, { maxSegmentLength: 8 });
    });
  }, [shapeList, shouldMorph]);

  // Morphing animation state
  const pathRef = useRef<SVGPathElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const totalCycle = morphDuration * shapeList.length * 1000; // ms for full cycle

  useAnimationFrame((time) => {
    if (!shouldMorph || !pathRef.current || interpolators.length === 0) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = time - phase * totalCycle;
    }

    const elapsed = (time - startTimeRef.current) % totalCycle;
    const segmentDuration = morphDuration * 1000;
    const segmentIndex = Math.floor(elapsed / segmentDuration);
    const segmentProgress = (elapsed % segmentDuration) / segmentDuration;

    // Ease in-out for smoother transitions
    const eased = segmentProgress < 0.5
      ? 2 * segmentProgress * segmentProgress
      : 1 - Math.pow(-2 * segmentProgress + 2, 2) / 2;

    const interp = interpolators[segmentIndex % interpolators.length];
    const d = interp(eased);
    pathRef.current.setAttribute('d', d);
  });

  // Use a unified viewBox that fits all shapes
  const viewBox = useMemo(() => {
    let maxW = 0, maxH = 0;
    for (const s of shapeList) {
      if (s.width > maxW) maxW = s.width;
      if (s.height > maxH) maxH = s.height;
    }
    return `0 0 ${maxW} ${maxH}`;
  }, [shapeList]);

  const staticPath = shapeList[0].d;
  const hasFillRule = shapeList.some((s) => s.fillRule === 'evenodd');

  const delay = phase * floatDuration;

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={{ position: 'absolute', ...style }}
      initial={enableFloat ? { y: 0, rotate: 0 } : undefined}
      animate={
        enableFloat
          ? {
              y: [0, -floatAmp, 0, floatAmp * 0.6, 0],
              rotate: rotate
                ? [0, rotateRange * 0.5, 0, -rotateRange * 0.5, 0]
                : 0,
            }
          : undefined
      }
      transition={
        enableFloat
          ? {
              duration: floatDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
          : undefined
      }
    >
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          ref={pathRef}
          d={staticPath}
          fill={fill}
          opacity={opacity}
          fillRule={hasFillRule ? 'evenodd' : undefined}
          clipRule={hasFillRule ? 'evenodd' : undefined}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    </motion.div>
  );
}

// ─── Static organic shape (no morph, just float) ────────────────────

export interface StaticOrganicShapeProps {
  shape: OrganicShape;
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
  float?: boolean;
  floatAmp?: number;
  floatDuration?: number;
  rotate?: boolean;
  rotateRange?: number;
  phase?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function StaticOrganicShape({
  shape,
  fill = C.sage,
  opacity = 1,
  stroke,
  strokeWidth = 0,
  float: enableFloat = true,
  floatAmp = 4,
  floatDuration = 6,
  rotate = true,
  rotateRange = 3,
  phase = 0,
  className = '',
  style,
}: StaticOrganicShapeProps) {
  const delay = phase * floatDuration;

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={{ position: 'absolute', ...style }}
      initial={enableFloat ? { y: 0, rotate: 0 } : undefined}
      animate={
        enableFloat
          ? {
              y: [0, -floatAmp, 0, floatAmp * 0.6, 0],
              rotate: rotate
                ? [0, rotateRange * 0.5, 0, -rotateRange * 0.5, 0]
                : 0,
            }
          : undefined
      }
      transition={
        enableFloat
          ? {
              duration: floatDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }
          : undefined
      }
    >
      <svg
        viewBox={shape.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={shape.d}
          fill={fill}
          opacity={opacity}
          fillRule={shape.fillRule}
          clipRule={shape.clipRule}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    </motion.div>
  );
}
