import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import MorphingShape from '../common/MorphingShape';
import { SLIDE_SHAPES } from '../../lib/organic-shapes';
import type { StatementSlide as StatementSlideData } from '../../data/slides-data';

export default function StatementSlide({ slide }: { slide: StatementSlideData }) {
  const [shape1, shape2] = SLIDE_SHAPES.statement;

  return (
    <div className="absolute inset-0 flex flex-col justify-center pl-[7%] pr-[7%]">
      {/* Decorative organic shapes */}
      <MorphingShape
        shapes={[shape1, shape2]}
        fill={C.sageLight}
        opacity={0.35}
        morphDuration={12}
        floatAmp={3}
        floatDuration={10}
        style={{
          left: '10%',
          top: '-8%',
          width: '85%',
          height: '95%',
        }}
      />
      <MorphingShape
        shapes={[shape2, shape1]}
        fill={C.sage}
        opacity={0.25}
        morphDuration={14}
        floatAmp={3}
        floatDuration={13}
        phase={0.3}
        style={{
          left: '20%',
          top: '5%',
          width: '85%',
          height: '95%',
        }}
      />

      {/* Heading */}
      <motion.h1
        className="relative z-10"
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: 'clamp(2.5rem, 4vw, 3.2rem)',
          fontWeight: 'bold',
          color: C.accentOlive,
          lineHeight: 0.92,
          whiteSpace: 'pre-line',
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
      >
        {slide.heading}
      </motion.h1>

      {/* Note */}
      {slide.note && (
        <motion.p
          className="relative z-10 mt-6"
          style={{
            fontFamily: "'Calibri', 'Helvetica Neue', sans-serif",
            fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
            color: C.accentOlive,
            fontStyle: 'italic',
            whiteSpace: 'pre-line',
            lineHeight: 1.6,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {slide.note}
        </motion.p>
      )}
    </div>
  );
}
