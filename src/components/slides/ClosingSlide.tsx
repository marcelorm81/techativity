import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { DECORATIVE_BLOBS } from '../../lib/blob-generator';
import OrganicBlob from '../common/OrganicBlob';
import type { ClosingSlide as ClosingSlideData } from '../../data/slides-data';

export default function ClosingSlide({ slide }: { slide: ClosingSlideData }) {
  const blobPaths = DECORATIVE_BLOBS.closing(600, 800);

  return (
    <div className="absolute inset-0 flex">
      {/* Left: blob + thank you */}
      <div className="relative w-[45%] h-full overflow-hidden">
        {blobPaths.map((path, i) => (
          <OrganicBlob
            key={i}
            path={path}
            fill={i === 0 ? C.sage : C.sageDark}
            opacity={i === 0 ? 1 : 0.4}
            viewBox={{ width: 600, height: 800 }}
            animate
            floatAmp={4}
            floatDuration={9 + i * 3}
            phase={i * 0.4}
            style={{
              left: '-8%',
              top: '-5%',
              width: '110%',
              height: '110%',
            }}
          />
        ))}

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
