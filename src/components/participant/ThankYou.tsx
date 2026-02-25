// ThankYou.tsx — Session complete screen with participant's 3 organic shapes
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { hashToSeed } from '../../lib/blob-generator';
import { SHAPES, SHAPE_KEYS } from '../../lib/organic-shapes';
import type { OrganicShape } from '../../lib/organic-shapes';

interface ThankYouProps {
  name: string;
}

const THEME_DISPLAY: { label: string; color: string }[] = [
  { label: 'Identity', color: C.sage },
  { label: 'Reality', color: C.warmGray },
  { label: 'Meaning', color: C.sageLight },
];

export default function ThankYou({ name }: ThankYouProps) {
  const seed = useMemo(() => hashToSeed(name), [name]);

  // Pick 3 shapes seeded by participant name
  const shapes = useMemo(
    () =>
      THEME_DISPLAY.map((t, i) => {
        const shapeKey = SHAPE_KEYS[(seed + i) % SHAPE_KEYS.length];
        return {
          ...t,
          shape: SHAPES[shapeKey],
        };
      }),
    [seed]
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: C.cream }}
    >
      <motion.div
        className="flex flex-col items-center max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Three organic shapes in a row */}
        <div className="flex items-center gap-5 mb-6">
          {shapes.map(({ label, color, shape }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 14,
                delay: 0.3 + i * 0.2,
              }}
            >
              <motion.div
                className="w-20 h-20"
                animate={{
                  y: [0, -3, 0, 2, 0],
                  rotate: [0, 1, 0, -1, 0],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.8,
                }}
              >
                <svg
                  viewBox={shape.viewBox}
                  className="w-full h-full"
                  style={{ overflow: 'visible' }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d={shape.d}
                    fill={color}
                    opacity={0.5}
                    fillRule={shape.fillRule}
                    clipRule={shape.clipRule}
                  />
                </svg>
              </motion.div>
              <span
                className="mt-1"
                style={{
                  fontFamily: "'Consolas', monospace",
                  fontSize: '0.55rem',
                  letterSpacing: '0.08em',
                  color: C.lightGray,
                  textTransform: 'uppercase' as const,
                }}
              >
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Thank you message */}
        <motion.h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: C.darkText,
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Thank you, {name}
        </motion.h2>

        <motion.p
          className="mt-3"
          style={{
            fontFamily: "'Calibri', sans-serif",
            fontSize: '0.9rem',
            color: C.midGray,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Your voice shaped this session.
          <br />
          The shapes above are uniquely yours.
        </motion.p>

        <motion.div
          className="mt-6 px-4 py-2 rounded-full"
          style={{
            backgroundColor: C.sagePale,
            fontFamily: "'Consolas', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            color: C.accentOlive,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Session complete
        </motion.div>
      </motion.div>
    </div>
  );
}
