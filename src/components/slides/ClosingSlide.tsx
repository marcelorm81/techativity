// ClosingSlide.tsx — Thank you / closing with organic shapes
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { StaticOrganicShape } from '../common/MorphingShape';
import { SHAPES } from '../../lib/organic-shapes';
import type { ClosingSlide as ClosingSlideData } from '../../data/slides-data';

export default function ClosingSlide({ slide }: { slide: ClosingSlideData }) {
  return (
    <div className="absolute inset-0 flex overflow-hidden">
      {/* Left: organic shapes + thank you */}
      <div className="relative w-[45%] h-full overflow-hidden">
        {/* Primary shape */}
        <StaticOrganicShape
          shape={SHAPES.bird}
          fill={C.olive}
          opacity={0.2}
          floatAmp={4}
          floatDuration={9}
          style={{
            left: '-8%',
            top: '-5%',
            width: '110%',
            height: '110%',
          }}
        />
        {/* Secondary shape */}
        <StaticOrganicShape
          shape={SHAPES.sun}
          fill={C.olive}
          opacity={0.1}
          floatAmp={4}
          floatDuration={12}
          phase={0.4}
          style={{
            left: '10%',
            top: '15%',
            width: '80%',
            height: '80%',
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-center pl-[15%]">
          <motion.h1
            style={{
              fontFamily: F.title,
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontWeight: 400,
              color: C.olive,
              lineHeight: 0.95,
              whiteSpace: 'pre-line',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {slide.heading}
          </motion.h1>

          <motion.p
            className="mt-auto mb-[12%]"
            style={{
              fontFamily: F.body,
              fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
              color: C.olive,
              opacity: 0.5,
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.7 }}
          >
            {slide.footer}
          </motion.p>
        </div>
      </div>

      {/* Right: subtitle + body */}
      <div className="flex-1 flex flex-col justify-center px-[8%]">
        <motion.p
          style={{
            fontFamily: F.title,
            fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
            color: C.white,
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {slide.subtitle}
        </motion.p>

        <motion.p
          className="mt-5"
          style={{
            fontFamily: F.body,
            fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)',
            color: 'rgba(255,255,255,0.6)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {slide.body}
        </motion.p>
      </div>
    </div>
  );
}
