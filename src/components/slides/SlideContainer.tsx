// SlideContainer.tsx — 16:9 aspect ratio wrapper with transitions
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { C, BG_COLORS } from '../../lib/design-system';
import type { BgMode } from '../../types/design';

export type TransitionStyle = 'fade' | 'slide' | 'scale' | 'dramatic';

interface SlideContainerProps {
  bgMode: BgMode;
  slideIndex: number;
  direction?: number; // -1 for back, 1 for forward
  transition?: TransitionStyle;
  children: ReactNode;
}

// Different transition presets for variety
const transitionVariants: Record<TransitionStyle, {
  enter: (d: number) => Record<string, unknown>;
  center: Record<string, unknown>;
  exit: (d: number) => Record<string, unknown>;
  transition: Record<string, unknown>;
}> = {
  fade: {
    enter: () => ({ opacity: 0 }),
    center: { opacity: 1 },
    exit: () => ({ opacity: 0 }),
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  slide: {
    enter: (d: number) => ({
      x: d > 0 ? '4%' : '-4%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({
      x: d > 0 ? '-4%' : '4%',
      opacity: 0,
    }),
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
  scale: {
    enter: () => ({ scale: 0.92, opacity: 0 }),
    center: { scale: 1, opacity: 1 },
    exit: () => ({ scale: 1.04, opacity: 0 }),
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  dramatic: {
    enter: () => ({ opacity: 0, scale: 0.95, filter: 'brightness(0)' }),
    center: { opacity: 1, scale: 1, filter: 'brightness(1)' },
    exit: () => ({ opacity: 0, scale: 0.98, filter: 'brightness(0)' }),
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SlideContainer({
  bgMode,
  slideIndex,
  direction = 1,
  transition: transStyle = 'slide',
  children,
}: SlideContainerProps) {
  const bgColor = BG_COLORS[bgMode];
  const tv = transitionVariants[transStyle];

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ aspectRatio: '16 / 9' }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slideIndex}
          custom={direction}
          variants={{
            enter: tv.enter,
            center: tv.center,
            exit: tv.exit,
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={tv.transition}
          className="absolute inset-0"
          style={{ backgroundColor: bgColor }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components for common slide elements ───────────────────────

export function Pill({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div
      className="inline-block px-3 py-1 rounded-full"
      style={{
        backgroundColor: dark ? C.tagBgDark : C.tagBg,
        fontFamily: "'Consolas', 'Monaco', monospace",
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
        color: dark ? C.sage : C.accentOlive,
        textTransform: 'uppercase',
      }}
    >
      {text}
    </div>
  );
}

export function SlideNumber({ num, light = false }: { num: number; light?: boolean }) {
  return (
    <div
      className="absolute bottom-4 right-6"
      style={{
        fontFamily: "'Consolas', 'Monaco', monospace",
        fontSize: '0.6rem',
        color: light ? C.warmGray : C.lightGray,
      }}
    >
      {num}
    </div>
  );
}

export function SectionNumber({ num, dark = false }: { num: string; dark?: boolean }) {
  return (
    <div
      className="absolute top-4 right-12"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: '5rem',
        fontWeight: 'bold',
        color: dark ? '#3D3D3D' : C.sageLight,
        lineHeight: 1,
        opacity: 0.8,
      }}
    >
      {num}
    </div>
  );
}

export function ContentCard({
  children,
  color = C.sagePale,
  className = '',
  style = {},
}: {
  children: ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{ backgroundColor: color, ...style }}
    >
      {children}
    </div>
  );
}
