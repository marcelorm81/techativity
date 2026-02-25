// AnswersSlide.tsx — Live answer visualization with force-directed blob garden
import { useMemo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { C } from '../../lib/design-system';
import { themedShapePath, type QuestionTheme } from '../../lib/blob-generator';
import { useBlobLayout } from '../../hooks/useBlobLayout';
import type { AnswersSlide as AnswersSlideData } from '../../data/slides-data';
import type { Answer } from '../../hooks/useAnswerSubscription';

interface AnswersSlideProps {
  slide: AnswersSlideData;
  answers?: Answer[];
}

// Theme-specific fill colors (softer palette for each theme)
const THEME_FILLS: Record<QuestionTheme, string[]> = {
  identity: [C.sage, C.sageLight, C.sageDark, '#B5C4AE', '#9AAD92'],
  reality: [C.warmGray, '#C5BEB6', '#A89F95', C.sage, '#B8AFA5'],
  meaning: [C.sage, C.sageLight, '#A3C49A', '#8DB585', '#C2D4BC'],
};

function getFillForAnswer(theme: QuestionTheme, seed: number): string {
  const fills = THEME_FILLS[theme];
  return fills[seed % fills.length];
}

// ─── Individual answer blob ──────────────────────────────────────────

interface BlobItemProps {
  answer: Answer;
  x: number;
  y: number;
  radius: number;
  theme: QuestionTheme;
  isNew: boolean;
  index: number;
}

function BlobItem({ answer, x, y, radius, theme, isNew, index }: BlobItemProps) {
  const shape = useMemo(
    () => themedShapePath(0, 0, radius * 1.8, theme, answer.seed),
    [radius, theme, answer.seed]
  );

  const fill = useMemo(
    () => getFillForAnswer(theme, answer.seed),
    [theme, answer.seed]
  );

  // Text sizing based on blob radius
  const nameFontSize = Math.max(8, Math.min(13, radius * 0.16));
  const textFontSize = Math.max(7, Math.min(11, radius * 0.13));
  const maxWidth = radius * 1.3;
  const maxCharsPerLine = Math.floor(maxWidth / (textFontSize * 0.52));
  const maxLines = Math.min(3, Math.floor((radius * 0.7) / (textFontSize * 1.3)));

  // Word-wrap the answer text
  const lines = useMemo(() => {
    const words = answer.text.split(' ');
    const result: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (test.length > maxCharsPerLine) {
        if (current) result.push(current);
        current = word;
        if (result.length >= maxLines) break;
      } else {
        current = test;
      }
    }
    if (current && result.length < maxLines) result.push(current);
    // Truncate last line if needed
    if (result.length > 0 && result.length === maxLines && answer.text.length > result.join(' ').length) {
      const last = result[result.length - 1];
      result[result.length - 1] = last.slice(0, -1) + '…';
    }
    return result;
  }, [answer.text, maxCharsPerLine, maxLines]);

  // Phase offset for idle float (deterministic per answer)
  const phase = (answer.seed % 100) / 100;
  const floatDuration = 4 + phase * 3;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        pointerEvents: 'none',
      }}
      initial={isNew ? { scale: 0, opacity: 0 } : false}
      animate={{
        scale: 1,
        opacity: 1,
        x: 0,
        y: [0, -2.5, 0, 1.5, 0],
      }}
      transition={{
        scale: {
          type: 'spring',
          stiffness: 180,
          damping: 14,
          delay: isNew ? index * 0.08 : 0,
        },
        opacity: { duration: 0.4, delay: isNew ? index * 0.08 : 0 },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: phase * 2,
        },
      }}
      layout
    >
      <svg
        viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {/* Shape */}
        <path
          d={shape.path}
          fill={fill}
          opacity={0.55}
          transform={shape.transform}
        />

        {/* Name */}
        <text
          x={0}
          y={-lines.length * textFontSize * 0.6}
          textAnchor="middle"
          fontFamily="'Georgia', serif"
          fontWeight="bold"
          fontSize={nameFontSize}
          fill={C.darkText}
          opacity={0.9}
        >
          {answer.name}
        </text>

        {/* Answer text lines */}
        {lines.map((line, i) => (
          <text
            key={i}
            x={0}
            y={-lines.length * textFontSize * 0.6 + nameFontSize * 1.4 + i * textFontSize * 1.25}
            textAnchor="middle"
            fontFamily="'Calibri', 'Helvetica Neue', sans-serif"
            fontSize={textFontSize}
            fill={C.midGray}
            opacity={0.85}
          >
            {line}
          </text>
        ))}
      </svg>
    </motion.div>
  );
}

// ─── Main AnswersSlide ───────────────────────────────────────────────

export default function AnswersSlide({ slide, answers = [] }: AnswersSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 960, height: 480 });

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setContainerSize({ width, height });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Layout engine
  const { positions } = useBlobLayout(answers, {
    width: containerSize.width,
    height: containerSize.height,
    padding: 15,
    maxRadius: Math.min(containerSize.width, containerSize.height) * 0.17,
    minRadius: Math.min(containerSize.width, containerSize.height) * 0.06,
  });

  const themeLabels: Record<QuestionTheme, string> = {
    identity: 'Q1 — Identity',
    reality: 'Q2 — Reality',
    meaning: 'Q3 — Meaning',
  };

  const themeQuestions: Record<QuestionTheme, string> = {
    identity: '"If you had to explain your job to a child, what would you say you do?"',
    reality: '"What do you actually spend most of your time doing in a normal week?"',
    meaning: '"At the end of a really good week, what makes you feel \'that was good work\'?"',
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: C.warmWhite }}>
      {/* Header */}
      <div className="px-[7%] pt-[4%] flex items-end justify-between">
        <div>
          <motion.div
            className="inline-block px-3 py-1 rounded-full"
            style={{
              backgroundColor: C.sagePale,
              fontFamily: "'Consolas', monospace",
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              color: C.accentOlive,
              textTransform: 'uppercase' as const,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Live answers
          </motion.div>
          <motion.h2
            className="mt-1"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
              fontWeight: 'bold',
              color: C.darkText,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {themeLabels[slide.theme]}
          </motion.h2>
        </div>
        <motion.p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 'clamp(0.65rem, 0.9vw, 0.85rem)',
            fontStyle: 'italic',
            color: C.midGray,
            marginBottom: '0.25rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.2 }}
        >
          {themeQuestions[slide.theme]}
        </motion.p>
      </div>

      {/* Blob garden area */}
      <div
        ref={containerRef}
        className="flex-1 relative mx-[4%] my-[1.5%] rounded-2xl overflow-hidden"
        style={{ backgroundColor: C.cream }}
      >
        <AnimatePresence>
          {answers.length === 0 ? (
            <motion.div
              key="waiting"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Animated placeholder blobs */}
              <div className="relative w-32 h-32">
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: [0.9, 1.05, 0.9],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="35" fill={C.sage} opacity={0.3} />
                  </svg>
                </motion.div>
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 0.92, 1],
                    opacity: [0.15, 0.3, 0.15],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="55" cy="45" r="25" fill={C.sageLight} opacity={0.3} />
                  </svg>
                </motion.div>
              </div>
              <motion.p
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: '0.85rem',
                  color: C.lightGray,
                }}
              >
                Waiting for answers…
              </motion.p>
            </motion.div>
          ) : (
            positions.map((pos, i) => {
              const answer = answers.find((a) => a.id === pos.id);
              if (!answer) return null;

              return (
                <BlobItem
                  key={pos.id}
                  answer={answer}
                  x={pos.x}
                  y={pos.y}
                  radius={pos.radius}
                  theme={slide.theme}
                  isNew={pos.isNew}
                  index={i}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Answer count bar */}
      <div className="px-[7%] pb-[2.5%] flex items-center gap-3">
        <div
          className="h-1 rounded-full flex-1"
          style={{ backgroundColor: C.sagePale }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: C.sage }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((answers.length / 18) * 100, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <span
          style={{
            fontFamily: "'Consolas', monospace",
            fontSize: '0.55rem',
            color: C.midGray,
          }}
        >
          {answers.length} / 18
        </span>
      </div>
    </div>
  );
}
