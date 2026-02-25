import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { DECORATIVE_BLOBS } from '../../lib/blob-generator';
import OrganicBlob from '../common/OrganicBlob';
import { Pill } from './SlideContainer';
import type { TitleSlide as TitleSlideData } from '../../data/slides-data';

export default function TitleSlide({ slide }: { slide: TitleSlideData }) {
  const blobPath = DECORATIVE_BLOBS.title(600, 900);

  return (
    <div className="absolute inset-0 flex">
      {/* Left content */}
      <div className="flex-1 flex flex-col justify-center pl-[7%] pr-[4%]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Pill text={slide.pill || 'Techativity'} />
        </motion.div>

        <motion.h1
          className="mt-4"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 'bold',
            color: C.black,
            lineHeight: 0.95,
            whiteSpace: 'pre-line',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          {slide.heading}
        </motion.h1>

        <motion.p
          className="mt-6"
          style={{
            fontFamily: "'Calibri', 'Helvetica Neue', sans-serif",
            fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
            color: C.midGray,
            fontStyle: 'italic',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {slide.subtitle}
        </motion.p>

        <motion.p
          className="mt-4"
          style={{
            fontFamily: "'Consolas', monospace",
            fontSize: '0.6rem',
            color: C.lightGray,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          {slide.footer}
        </motion.p>
      </div>

      {/* Right blob */}
      <OrganicBlob
        path={blobPath}
        fill={C.sage}
        viewBox={{ width: 600, height: 900 }}
        animate
        floatAmp={5}
        floatDuration={8}
        style={{
          right: '-2%',
          top: '-3%',
          width: '42%',
          height: '106%',
        }}
      />
    </div>
  );
}
