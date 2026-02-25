// TitleSlide.tsx — Cover: olive bg, white shapes at edges, QR inside sunBlob
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
      {/* Decorative white shapes scattered around edges — matching Figma layout */}

      {/* Bird — top-left */}
      <StaticOrganicShape shape={SHAPES.bird} fill={C.white} opacity={0.9} floatAmp={3} floatDuration={9}
        style={{ left: '-2%', top: '-4%', width: '18%', height: '32%' }} />

      {/* Man — top-right */}
      <StaticOrganicShape shape={SHAPES.man} fill={C.white} opacity={0.9} floatAmp={4} floatDuration={8}
        style={{ right: '-2%', top: '-3%', width: '18%', height: '32%' }} />

      {/* Phone — right-middle */}
      <StaticOrganicShape shape={SHAPES.phone} fill={C.white} opacity={0.9} floatAmp={3} floatDuration={10}
        style={{ right: '0%', top: '30%', width: '12%', height: '28%' }} />

      {/* Mountain — left-middle */}
      <StaticOrganicShape shape={SHAPES.mountain} fill={C.white} opacity={0.9} floatAmp={3} floatDuration={10} phase={0.7}
        rotate rotateRange={5}
        style={{ left: '-3%', top: '38%', width: '18%', height: '22%' }} />

      {/* Cloud — bottom-left */}
      <StaticOrganicShape shape={SHAPES.cloud} fill={C.white} opacity={0.9} floatAmp={4} floatDuration={11} phase={0.3}
        style={{ left: '-3%', bottom: '-5%', width: '20%', height: '30%' }} />

      {/* SunBlob — bottom-right (large, holds QR code) */}
      <StaticOrganicShape shape={SHAPES.sunBlob} fill={C.white} opacity={0.9} floatAmp={3} floatDuration={9} phase={0.5}
        style={{ right: '-1%', bottom: '-4%', width: '22%', height: '32%' }} />

      {/* Main content — centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[15%]">
        <motion.h1
          style={{
            fontFamily: F.title,
            fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
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
            fontSize: 'clamp(1.5rem, 3.2vw, 2.8rem)',
            color: C.white,
            textAlign: 'center',
            opacity: 0.8,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {slide.subtitle}
        </motion.p>
      </div>

      {/* QR code inside bottom-right sunBlob area */}
      {sessionInfo && (
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            right: '2%',
            bottom: '4%',
            width: '14%',
            aspectRatio: '1',
            zIndex: 10,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="rounded-xl p-2" style={{ backgroundColor: C.white }}>
            <QRCodeSVG value={sessionInfo.joinUrl} size={90} bgColor={C.white} fgColor={C.olive} level="M" />
          </div>
        </motion.div>
      )}

      {/* Session URL + footer at bottom center */}
      <motion.div
        className="absolute bottom-[3%] left-0 right-0 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{ zIndex: 10 }}
      >
        {sessionInfo && (
          <span
            style={{
              fontFamily: F.body,
              fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
              color: C.white,
              opacity: 0.6,
              letterSpacing: '0.04em',
            }}
          >
            {window.location.host}/join · {sessionInfo.sessionId}
          </span>
        )}
        <span
          style={{
            fontFamily: F.body,
            fontSize: 'clamp(0.65rem, 0.85vw, 0.8rem)',
            color: C.white,
            opacity: 0.35,
            marginTop: '0.3em',
          }}
        >
          {slide.footer}
        </span>
      </motion.div>
    </div>
  );
}
