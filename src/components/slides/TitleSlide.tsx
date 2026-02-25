// TitleSlide.tsx — Cover: cream bg, large Gambarino heading, olive green shapes at edges
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { StaticOrganicShape } from '../common/MorphingShape';
import { SHAPES } from '../../lib/organic-shapes';
import type { TitleSlide as TitleSlideData } from '../../data/slides-data';
import type { SessionInfo } from './SlideRenderer';
import { QRCodeSVG } from 'qrcode.react';

interface TitleSlideProps {
  slide: TitleSlideData;
  sessionInfo?: SessionInfo | null;
}

export default function TitleSlide({ slide, sessionInfo }: TitleSlideProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Decorative olive shapes scattered around edges */}
      <StaticOrganicShape shape={SHAPES.bird} fill={C.olive} opacity={1} floatAmp={3} floatDuration={9}
        style={{ left: '-2%', top: '-4%', width: '18%', height: '32%' }} />
      <StaticOrganicShape shape={SHAPES.man} fill={C.olive} opacity={1} floatAmp={4} floatDuration={8}
        style={{ right: '-2%', top: '-3%', width: '18%', height: '32%' }} />
      <StaticOrganicShape shape={SHAPES.phone} fill={C.olive} opacity={1} floatAmp={3} floatDuration={10}
        style={{ right: '0%', top: '30%', width: '12%', height: '28%' }} />
      <StaticOrganicShape shape={SHAPES.sun} fill={C.olive} opacity={1} floatAmp={4} floatDuration={11} phase={0.3}
        style={{ left: '-3%', bottom: '-5%', width: '20%', height: '32%' }} />
      <StaticOrganicShape shape={SHAPES.mountain} fill={C.olive} opacity={1} floatAmp={3} floatDuration={9} phase={0.5}
        style={{ right: '-1%', bottom: '-8%', width: '18%', height: '22%' }} />
      <StaticOrganicShape shape={SHAPES.phone} fill={C.olive} opacity={1} floatAmp={3} floatDuration={10} phase={0.7}
        rotate rotateRange={8}
        style={{ left: '-2%', top: '32%', width: '16%', height: '35%' }} />

      {/* Main content — centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[15%]">
        <motion.h1
          style={{
            fontFamily: F.title,
            fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
            fontWeight: 400,
            color: C.olive,
            lineHeight: 0.95,
            textAlign: 'center',
            whiteSpace: 'pre-line',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {slide.heading}
        </motion.h1>

        <motion.p
          className="mt-[6%]"
          style={{
            fontFamily: F.body,
            fontSize: 'clamp(1.5rem, 3.2vw, 2.8rem)',
            color: C.olive,
            textAlign: 'center',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {slide.subtitle}
        </motion.p>
      </div>

      {/* Session join overlay */}
      {sessionInfo && (
        <motion.div
          className="absolute flex items-end gap-4"
          style={{ bottom: '5%', right: '5%', zIndex: 10 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex flex-col items-end">
            <span style={{ fontFamily: F.body, fontSize: 'clamp(0.8rem, 1vw, 0.95rem)', color: C.olive, opacity: 0.7 }}>
              Join at
            </span>
            <span style={{ fontFamily: F.body, fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', color: C.olive }}>
              {window.location.host}/join
            </span>
            <span style={{ fontFamily: F.body, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: C.olive, letterSpacing: '0.15em', lineHeight: 1.1, marginTop: '0.2em' }}>
              {sessionInfo.sessionId}
            </span>
            <span style={{ fontFamily: F.body, fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)', color: C.olive, opacity: 0.5, marginTop: '0.3em' }}>
              {sessionInfo.participantCount} joined
            </span>
          </div>
          <div className="rounded-lg p-2" style={{ backgroundColor: C.white }}>
            <QRCodeSVG value={sessionInfo.joinUrl} size={80} bgColor={C.white} fgColor={C.olive} level="M" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
