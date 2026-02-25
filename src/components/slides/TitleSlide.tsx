// TitleSlide.tsx — Cover: dark olive bg, large Gambarino heading, white shapes at edges
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
      {/* Decorative white shapes scattered around edges */}
      <StaticOrganicShape shape={SHAPES.bird} fill={C.white} opacity={1} floatAmp={3} floatDuration={9}
        style={{ left: '-2%', top: '-4%', width: '18%', height: '32%' }} />
      <StaticOrganicShape shape={SHAPES.man} fill={C.white} opacity={1} floatAmp={4} floatDuration={8}
        style={{ right: '-2%', top: '-3%', width: '18%', height: '32%' }} />
      <StaticOrganicShape shape={SHAPES.phone} fill={C.white} opacity={1} floatAmp={3} floatDuration={10}
        style={{ right: '0%', top: '30%', width: '12%', height: '28%' }} />
      <StaticOrganicShape shape={SHAPES.sun} fill={C.white} opacity={1} floatAmp={4} floatDuration={11} phase={0.3}
        style={{ left: '-3%', bottom: '-5%', width: '20%', height: '32%' }} />
      <StaticOrganicShape shape={SHAPES.mountain} fill={C.white} opacity={1} floatAmp={3} floatDuration={9} phase={0.5}
        style={{ right: '-1%', bottom: '-8%', width: '18%', height: '22%' }} />
      <StaticOrganicShape shape={SHAPES.phone} fill={C.white} opacity={1} floatAmp={3} floatDuration={10} phase={0.7}
        rotate rotateRange={8}
        style={{ left: '-2%', top: '32%', width: '16%', height: '35%' }} />

      {/* Main content — centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[15%]">
        <motion.h1
          style={{
            fontFamily: F.title,
            fontSize: 'clamp(3rem, 7.8vw, 6.5rem)',
            fontWeight: 400,
            color: C.white,
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
            fontSize: 'clamp(1.2rem, 2.8vw, 2.3rem)',
            color: C.white,
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
            <span style={{ fontFamily: F.body, fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)', color: C.white, opacity: 0.7 }}>
              Join at
            </span>
            <span style={{ fontFamily: F.body, fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)', color: C.white }}>
              {window.location.host}/join
            </span>
            <span style={{ fontFamily: F.body, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: C.white, letterSpacing: '0.15em', lineHeight: 1.1, marginTop: '0.2em' }}>
              {sessionInfo.sessionId}
            </span>
            <span style={{ fontFamily: F.body, fontSize: 'clamp(0.5rem, 0.7vw, 0.6rem)', color: C.white, opacity: 0.5, marginTop: '0.3em' }}>
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
