import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import MorphingShape from '../common/MorphingShape';
import { SLIDE_SHAPES, SHAPES } from '../../lib/organic-shapes';
import type { ClosingSlide as ClosingSlideData } from '../../data/slides-data';

export default function ClosingSlide({ slide }: { slide: ClosingSlideData }) {
  const [shape1, shape2] = SLIDE_SHAPES.closing;

  return (
    <div className="absolute inset-0 flex">
      {/* Left: organic shapes + thank you */}
      <div className="relative w-[45%] h-full overflow-hidden">
        {/* Primary shape — morphs man → bird */}
        <MorphingShape
          shapes={[shape1, SHAPES.bird]}
          fill={C.sage}
          morphDuration={12}
          floatAmp={4}
          floatDuration={9}
          style={{
            left: '-8%',
            top: '-5%',
            width: '110%',
            height: '110%',
          }}
        />
        {/* Secondary shape — morphs sun → mountain */}
        <MorphingShape
          shapes={[shape2, SHAPES.mountain]}
          fill={C.sageDark}
          opacity={0.4}
          morphDuration={14}
          floatAmp={4}
          floatDuration={12}
          phase={0.4}
          style={{
            left: '-8%',
            top: '-5%',
            width: '110%',
            height: '110%',
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-center pl-[15%]">
          <motion.h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(2.5rem, 4vw, 3.2rem)',
              fontWeight: 'bold',
              color: C.accentOlive,
              lineHeight: 0.92,
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
              fontFamily: "'Calibri', sans-serif",
              fontSize: '0.65rem',
              color: C.accentOlive,
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
            fontFamily: "'Georgia', serif",
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
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
          className="mt-4"
          style={{
            fontFamily: "'Calibri', sans-serif",
            fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
            color: C.warmGray,
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
