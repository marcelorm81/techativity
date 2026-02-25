import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { DECORATIVE_BLOBS } from '../../lib/blob-generator';
import OrganicBlob from '../common/OrganicBlob';
import { ContentCard } from './SlideContainer';
import type { QuestionSlide as QuestionSlideData } from '../../data/slides-data';

export default function QuestionSlide({ slide }: { slide: QuestionSlideData }) {
  const qNum = slide.question ? slide.question.substring(0, 2) : '';
  const pebblePath = DECORATIVE_BLOBS.pebble(60, 60, 45);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-[4%]">
      {/* Main card */}
      <motion.div
        className="relative w-[90%] h-[85%] rounded-xl overflow-hidden flex flex-col"
        style={{ backgroundColor: C.white }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 px-[6%] pt-[5%] pb-[3%] flex flex-col justify-center">
          {/* Q number */}
          <motion.span
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 'bold',
              color: C.sageLight,
              lineHeight: 1,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {qNum}
          </motion.span>

          {/* Question text */}
          <motion.h2
            className="mt-3"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)',
              fontWeight: 'bold',
              color: C.black,
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {slide.question.replace(/^Q\d\s*/, '')}
          </motion.h2>

          {/* Follow-up */}
          {slide.followup && (
            <motion.p
              className="mt-4"
              style={{
                fontFamily: "'Calibri', sans-serif",
                fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
                color: C.sageDark,
                fontStyle: 'italic',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {slide.followup}
            </motion.p>
          )}
        </div>

        {/* Pebble accent */}
        <OrganicBlob
          path={pebblePath}
          fill={C.sage}
          viewBox={{ width: 120, height: 120 }}
          animate
          floatAmp={2}
          floatDuration={5}
          style={{
            position: 'absolute',
            top: '8%',
            right: '5%',
            width: '5%',
            height: '10%',
          }}
        />

        {/* Bottom notes strip */}
        {slide.notes && (
          <motion.div
            className="px-[6%] py-3"
            style={{ backgroundColor: C.sagePale }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <p
              style={{
                fontFamily: "'Calibri', sans-serif",
                fontSize: '0.6rem',
                color: C.sageDark,
              }}
            >
              {slide.notes}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
