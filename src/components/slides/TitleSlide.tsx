import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import MorphingShape from '../common/MorphingShape';
import { SLIDE_SHAPES, SHAPES } from '../../lib/organic-shapes';
import { Pill } from './SlideContainer';
import type { TitleSlide as TitleSlideData } from '../../data/slides-data';
import type { SessionInfo } from './SlideRenderer';
import { QRCodeSVG } from 'qrcode.react';

interface TitleSlideProps {
  slide: TitleSlideData;
  sessionInfo?: SessionInfo | null;
}

export default function TitleSlide({ slide, sessionInfo }: TitleSlideProps) {
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

      {/* Right organic shape — morphs man → sun → bird */}
      <MorphingShape
        shapes={[SLIDE_SHAPES.title, SHAPES.sun, SHAPES.bird]}
        fill={C.sage}
        morphDuration={10}
        floatAmp={5}
        floatDuration={8}
        style={{
          right: '-2%',
          top: '-3%',
          width: '42%',
          height: '106%',
        }}
      />

      {/* Session join overlay — bottom-right corner */}
      {sessionInfo && (
        <motion.div
          className="absolute flex items-end gap-4"
          style={{
            bottom: '5%',
            right: '5%',
            zIndex: 10,
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {/* Text info */}
          <div className="flex flex-col items-end">
            <span
              style={{
                fontFamily: "'Consolas', monospace",
                fontSize: 'clamp(0.5rem, 0.7vw, 0.6rem)',
                color: C.white,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              Join at
            </span>
            <span
              style={{
                fontFamily: "'Calibri', sans-serif",
                fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
                color: C.white,
                fontWeight: 600,
              }}
            >
              {window.location.host}/join
            </span>
            <span
              style={{
                fontFamily: "'Consolas', monospace",
                fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)',
                color: C.white,
                fontWeight: 'bold',
                letterSpacing: '0.15em',
                lineHeight: 1.1,
                marginTop: '0.2em',
              }}
            >
              {sessionInfo.sessionId}
            </span>
            <span
              style={{
                fontFamily: "'Calibri', sans-serif",
                fontSize: 'clamp(0.45rem, 0.6vw, 0.55rem)',
                color: C.white,
                opacity: 0.5,
                marginTop: '0.3em',
              }}
            >
              {sessionInfo.participantCount} joined
            </span>
          </div>

          {/* QR code */}
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: C.white }}
          >
            <QRCodeSVG
              value={sessionInfo.joinUrl}
              size={80}
              bgColor={C.white}
              fgColor={C.black}
              level="M"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
