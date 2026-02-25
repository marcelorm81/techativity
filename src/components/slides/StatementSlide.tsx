// StatementSlide.tsx — Large statement text with single decorative organic shape
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { StaticOrganicShape } from '../common/MorphingShape';
import { SHAPES } from '../../lib/organic-shapes';
import type { StatementSlide as StatementSlideData } from '../../data/slides-data';

export default function StatementSlide({ slide }: { slide: StatementSlideData }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large decorative organic shape — right side, white on olive bg */}
      <StaticOrganicShape
        shape={SHAPES.bird}
        fill={C.white}
        opacity={0.08}
        floatAmp={4}
        floatDuration={12}
        style={{
          right: '-8%',
          top: '5%',
          width: '50%',
          height: '90%',
        }}
      />

      {/* Content — left-aligned, vertically centered */}
      <div className="absolute inset-0 flex flex-col justify-center pl-[8%] pr-[50%]">
        {/* Small label pill — white border on olive bg */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span
            className="inline-block px-5 py-2 rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              fontFamily: F.body,
              fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)',
              letterSpacing: '0.08em',
              color: C.white,
            }}
          >
            {slide.heading?.split('\n')[0] || 'Statement'}
          </span>
        </motion.div>

        {/* Main statement text — very large Gambarino, white */}
        <motion.h1
          style={{
            fontFamily: F.title,
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 400,
            color: C.white,
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
              fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
              color: C.white,
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
