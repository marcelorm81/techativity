// OrganicBlob.tsx — Animated SVG blob component with floating motion
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { blobPath, type BlobOptions } from '../../lib/blob-generator';
import { C } from '../../lib/design-system';

export interface OrganicBlobProps {
  /** Pre-computed SVG path string (takes priority over shape generation) */
  path?: string;
  /** If no path provided, generate a blob with these options */
  blobOpts?: BlobOptions & { cx?: number; cy?: number; radius?: number };
  /** Fill color (default: sage) */
  fill?: string;
  /** Opacity (0-1) */
  opacity?: number;
  /** SVG transform string (e.g. rotate) */
  transform?: string;
  /** Enable floating animation */
  animate?: boolean;
  /** Float amplitude in px (default: 4) */
  floatAmp?: number;
  /** Float duration in seconds (default: 6) */
  floatDuration?: number;
  /** Phase offset for animation (0-1, used to desync multiple blobs) */
  phase?: number;
  /** Enable slow rotation */
  rotate?: boolean;
  /** Rotation range in degrees (default: 3) */
  rotateRange?: number;
  /** Additional className for the wrapper */
  className?: string;
  /** Style overrides for positioning */
  style?: React.CSSProperties;
  /** Width/height of the SVG viewBox */
  viewBox?: { width: number; height: number };
}

export default function OrganicBlob({
  path,
  blobOpts,
  fill = C.sage,
  opacity = 1,
  transform,
  animate = true,
  floatAmp = 4,
  floatDuration = 6,
  phase = 0,
  rotate = true,
  rotateRange = 3,
  className = '',
  style,
  viewBox,
}: OrganicBlobProps) {
  // Generate path if not provided
  const svgPath = useMemo(() => {
    if (path) return path;
    if (blobOpts) {
      return blobPath(
        blobOpts.cx ?? 50,
        blobOpts.cy ?? 50,
        blobOpts.radius ?? 40,
        blobOpts
      );
    }
    return blobPath(50, 50, 40, { seed: 42, points: 8, wobble: 0.3 });
  }, [path, blobOpts]);

  const vb = viewBox ?? { width: 100, height: 100 };
  const delay = phase * floatDuration;

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      style={{ position: 'absolute', ...style }}
      initial={animate ? { y: 0, rotate: 0 } : undefined}
      animate={
        animate
          ? {
              y: [0, -floatAmp, 0, floatAmp * 0.6, 0],
              rotate: rotate
                ? [0, rotateRange * 0.5, 0, -rotateRange * 0.5, 0]
                : 0,
            }
          : undefined
      }
      transition={
        animate
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
        viewBox={`0 0 ${vb.width} ${vb.height}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path
          d={svgPath}
          fill={fill}
          opacity={opacity}
          transform={transform}
        />
      </svg>
    </motion.div>
  );
}

// ─── Convenience wrapper for answer blobs ───────────────────────────

export interface AnswerBlobProps {
  /** SVG path for the blob shape */
  shapePath: string;
  /** SVG transform */
  shapeTransform?: string;
  /** Fill color */
  fill?: string;
  /** Participant name */
  name: string;
  /** Answer text */
  text: string;
  /** Blob size (diameter) in px */
  size: number;
  /** Position {x, y} in container-relative px */
  position: { x: number; y: number };
  /** Animation delay (stagger) */
  enterDelay?: number;
  /** Phase offset for idle float */
  phase?: number;
}

export function AnswerBlob({
  shapePath,
  shapeTransform,
  fill = C.sage,
  name,
  text,
  size,
  position,
  enterDelay = 0,
  phase = 0,
}: AnswerBlobProps) {
  const r = size / 2;
  const fontSize = Math.max(10, Math.min(14, size * 0.08));
  const nameFontSize = fontSize * 0.85;
  const maxChars = Math.floor((size * 0.7) / (fontSize * 0.55));
  const truncatedText =
    text.length > maxChars ? text.slice(0, maxChars - 1) + '…' : text;

  // Break text into lines for SVG
  const wordsPerLine = Math.floor(size * 0.65 / (fontSize * 0.55));
  const words = truncatedText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > wordsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  // Limit to 3 lines
  const displayLines = lines.slice(0, 3);
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].slice(0, -1) + '…';
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: position.x - r,
        top: position.y - r,
        width: size,
        height: size,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: [0, -3, 0, 2, 0],
      }}
      transition={{
        scale: { type: 'spring', stiffness: 200, damping: 15, delay: enterDelay },
        opacity: { duration: 0.4, delay: enterDelay },
        y: {
          duration: 4 + phase * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: enterDelay + phase * 1.5,
        },
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {/* Shape */}
        <g transform={`translate(${r}, ${r}) scale(${r / 50})`}>
          <path
            d={shapePath}
            fill={fill}
            opacity={0.7}
            transform={shapeTransform}
          />
        </g>
        {/* Name */}
        <text
          x={r}
          y={r - displayLines.length * fontSize * 0.5}
          textAnchor="middle"
          fontFamily="'Gambarino', 'Georgia', serif"
          fontWeight="bold"
          fontSize={nameFontSize}
          fill={C.darkText}
          opacity={0.9}
        >
          {name}
        </text>
        {/* Answer text lines */}
        {displayLines.map((line, i) => (
          <text
            key={i}
            x={r}
            y={r - displayLines.length * fontSize * 0.5 + nameFontSize * 1.3 + i * fontSize * 1.25}
            textAnchor="middle"
            fontFamily="'Gambarino', 'Georgia', serif"
            fontSize={fontSize}
            fill={C.midGray}
          >
            {line}
          </text>
        ))}
      </svg>
    </motion.div>
  );
}
