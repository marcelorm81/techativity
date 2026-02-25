import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { DECORATIVE_BLOBS } from '../../lib/blob-generator';
import OrganicBlob from '../common/OrganicBlob';
import type { StatementSlide as StatementSlideData } from '../../data/slides-data';

export default function StatementSlide({ slide }: { slide: StatementSlideData }) {
  const blobPaths = DECORATIVE_BLOBS.statement(900, 600);

  return (
    <div className="absolute inset-0 flex flex-col justify-center pl-[7%] pr-[7%]">
      {/* Decorative blobs */}
      {blobPaths.map((path, i) => (
        <OrganicBlob
          key={i}
          path={path}
          fill={i === 0 ? C.sageLight : C.sage}
          opacity={i === 0 ? 0.35 : 0.25}
          viewBox={{ width: 900, height: 600 }}
          animate
          floatAmp={3}
          floatDuration={10 + i * 3}
          phase={i * 0.3}
          style={{
            left: i === 0 ? '10%' : '20%',
            top: i === 0 ? '-8%' : '5%',
            width: '85%',
            height: '95%',
          }}
        />
      ))}

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
