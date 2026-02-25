// QuestionSlide.tsx — Centered question with animated cycling shape icon
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { SHAPES } from '../../lib/organic-shapes';
import type { QuestionSlide as QuestionSlideData } from '../../data/slides-data';

const CYCLE_SHAPES = [SHAPES.bird, SHAPES.man, SHAPES.mountain, SHAPES.sun];
const CYCLE_INTERVAL = 2500;

export default function QuestionSlide({ slide }: { slide: QuestionSlideData }) {
  const [shapeIndex, setShapeIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setShapeIndex((i) => (i + 1) % CYCLE_SHAPES.length);
    }, CYCLE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Strip Q number prefix if present
  const questionText = slide.question.replace(/^Q\d\s*/, '');
  const currentShape = CYCLE_SHAPES[shapeIndex];

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center">
      {/* Animated cycling shape icon above question */}
      <motion.div
        className="mb-8 relative"
        style={{
          width: 'clamp(90px, 12vw, 160px)',
          height: 'clamp(90px, 12vw, 160px)',
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={shapeIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <svg
              viewBox={currentShape.viewBox}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: 'visible' }}
            >
              <path
                d={currentShape.d}
                fill={C.olive}
                opacity={0.25}
                fillRule={currentShape.fillRule}
                clipRule={currentShape.clipRule}
              />
            </svg>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Question text — centered, large Gambarino */}
      <motion.h2
        className="px-[10%] text-center"
        style={{
          fontFamily: F.title,
          fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
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
            fontSize: 'clamp(1.1rem, 1.7vw, 1.5rem)',
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
          className="absolute bottom-0 left-0 right-0 px-[7%] py-5"
          style={{ backgroundColor: C.creamDark }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <p
            style={{
              fontFamily: F.body,
              fontSize: 'clamp(0.75rem, 1vw, 0.95rem)',
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
