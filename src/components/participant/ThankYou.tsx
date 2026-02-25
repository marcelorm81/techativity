// ThankYou.tsx — Session complete screen with participant's 3 organic shapes
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { hashToSeed } from '../../lib/blob-generator';
import { SHAPES, SHAPE_KEYS } from '../../lib/organic-shapes';
import type { OrganicShape } from '../../lib/organic-shapes';

interface ThankYouProps {
  name: string;
}

const THEME_DISPLAY: { label: string; color: string }[] = [
  { label: 'Identity', color: C.olive },
  { label: 'Reality', color: C.oliveLight },
  { label: 'Meaning', color: C.oliveDark },
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
        <div className="flex items-center gap-5 mb-8">
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
                className="mt-2"
                style={{
                  fontFamily: F.body,
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  color: C.olive,
                  opacity: 0.4,
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
            fontFamily: F.title,
            fontSize: '1.6rem',
            fontWeight: 400,
            color: C.olive,
            textAlign: 'center',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Thank you, {name}
        </motion.h2>

        <motion.p
          className="mt-4"
          style={{
            fontFamily: F.body,
            fontSize: '0.95rem',
            color: C.olive,
            opacity: 0.5,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
        >
          Your voice shaped this session.
          <br />
          The shapes above are uniquely yours.
        </motion.p>

        <motion.div
          className="mt-7 px-5 py-2 rounded-full"
          style={{
            backgroundColor: C.creamDark,
            fontFamily: F.body,
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            color: C.olive,
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
