// QuestionSlide.tsx — Centered question with small decorative shape icon
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { StaticOrganicShape } from '../common/MorphingShape';
import { SHAPES } from '../../lib/organic-shapes';
import type { QuestionSlide as QuestionSlideData } from '../../data/slides-data';

export default function QuestionSlide({ slide }: { slide: QuestionSlideData }) {
  // Strip Q number prefix if present
  const questionText = slide.question.replace(/^Q\d\s*/, '');

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center">
      {/* Small decorative shape icon above question */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <StaticOrganicShape
          shape={SHAPES.sun}
          fill={C.olive}
          opacity={0.25}
          floatAmp={3}
          floatDuration={7}
          style={{
            position: 'relative',
            width: 'clamp(80px, 10vw, 140px)',
            height: 'clamp(80px, 10vw, 140px)',
          }}
        />
      </motion.div>

      {/* Question text — centered, large Gambarino */}
      <motion.h2
        className="px-[12%] text-center"
        style={{
          fontFamily: F.title,
          fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
          fontWeight: 400,
          color: C.olive,
          lineHeight: 1.1,
          whiteSpace: 'pre-line',
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {questionText}
      </motion.h2>

      {/* Follow-up text */}
      {slide.followup && (
        <motion.p
          className="mt-6 px-[15%] text-center"
          style={{
            fontFamily: F.body,
            fontSize: 'clamp(0.8rem, 1.3vw, 1.1rem)',
            color: C.olive,
            opacity: 0.5,
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6 }}
        >
          {slide.followup}
        </motion.p>
      )}

      {/* Notes strip at bottom */}
      {slide.notes && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-[7%] py-4"
          style={{ backgroundColor: C.creamDark }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <p
            style={{
              fontFamily: F.body,
              fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)',
              color: C.olive,
              opacity: 0.5,
            }}
          >
            {slide.notes}
          </p>
        </motion.div>
      )}
    </div>
  );
}
