// SectionDivider.tsx — Section transition slide with large Gambarino heading
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { StaticOrganicShape } from '../common/MorphingShape';
import { SHAPES } from '../../lib/organic-shapes';
import { Pill, SectionNumber } from './SlideContainer';
import type { SectionSlide } from '../../data/slides-data';

export default function SectionDivider({ slide }: { slide: SectionSlide }) {
  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col justify-center pl-[7%] pr-[7%]">
      {/* Pill */}
      <motion.div
        className="absolute top-[8%] left-[7%]"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <Pill text={`Section ${slide.number.replace('0', '')}`} dark />
      </motion.div>

      {/* Section number (decorative) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <SectionNumber num={slide.number} dark />
      </motion.div>

      {/* Heading */}
      <motion.h1
        style={{
          fontFamily: F.title,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 400,
          color: C.white,
          lineHeight: 0.95,
          whiteSpace: 'pre-line',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {slide.heading}
      </motion.h1>

      {/* Body */}
      <motion.p
        className="mt-6 max-w-[60%]"
        style={{
          fontFamily: F.body,
          fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
      >
        {slide.body}
      </motion.p>

      {/* Decorative organic shape — bottom right */}
      <StaticOrganicShape
        shape={SHAPES.mountain}
        fill={C.white}
        opacity={0.08}
        floatAmp={3}
        floatDuration={10}
        style={{
          right: '-3%',
          bottom: '-5%',
          width: '30%',
          height: '65%',
        }}
      />
    </div>
  );
}
