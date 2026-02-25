// StatementSlide.tsx — Large statement text with single decorative organic shape
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { StaticOrganicShape } from '../common/MorphingShape';
import { SHAPES } from '../../lib/organic-shapes';
import type { StatementSlide as StatementSlideData } from '../../data/slides-data';

export default function StatementSlide({ slide }: { slide: StatementSlideData }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large decorative organic shape — right side */}
      <StaticOrganicShape
        shape={SHAPES.bird}
        fill={C.olive}
        opacity={0.15}
        floatAmp={4}
        floatDuration={10}
        style={{
          right: '-8%',
          top: '5%',
          width: '50%',
          height: '90%',
        }}
      />

      {/* Content — left-aligned, vertically centered */}
      <div className="absolute inset-0 flex flex-col justify-center pl-[8%] pr-[50%]">
        {/* Small label */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: C.creamDark,
              fontFamily: F.body,
              fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
              letterSpacing: '0.08em',
              color: C.olive,
            }}
          >
            {slide.heading?.split('\n')[0] || 'Before we start'}
          </span>
        </motion.div>

        {/* Main statement text — very large Gambarino */}
        <motion.h1
          style={{
            fontFamily: F.title,
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 400,
            color: C.olive,
            lineHeight: 1.05,
            whiteSpace: 'pre-line',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          {slide.heading}
        </motion.h1>

        {/* Optional note */}
        {slide.note && (
          <motion.p
            className="mt-8"
            style={{
              fontFamily: F.body,
              fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
              color: C.olive,
              opacity: 0.6,
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {slide.note}
          </motion.p>
        )}
      </div>
    </div>
  );
}
