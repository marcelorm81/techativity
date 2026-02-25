// ContentSlide.tsx — Content slide with organic shape containers per Figma
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { SHAPES } from '../../lib/organic-shapes';
import type { OrganicShape } from '../../lib/organic-shapes';
import { Pill, SlideNumber } from './SlideContainer';
import { StaticOrganicShape } from '../common/MorphingShape';
import type { ContentSlide as ContentSlideData } from '../../data/slides-data';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Use sunBlob for all card shapes — consistent visual language
const CARD_SHAPES: OrganicShape[] = [SHAPES.sunBlob];

// ─── Organic Shape Card ────────────────────────────────────────────

function ShapeCard({
  shape,
  title,
  content,
  index,
}: {
  shape: OrganicShape;
  title?: string;
  content: string;
  index: number;
}) {
  const floatDuration = 10 + index * 2;
  const phase = index * 0.3;

  return (
    <motion.div
      className="relative flex-1 flex items-center justify-center"
      style={{ minHeight: '320px' }}
      variants={fadeUp}
    >
      {/* Organic shape background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          y: [0, -4, 0, 3, 0],
          rotate: [0, 0.7, 0, -0.7, 0],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: phase,
        }}
      >
        <svg
          viewBox={shape.viewBox}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <path
            d={shape.d}
            fill={C.olive}
            opacity={0.85}
            fillRule={shape.fillRule}
            clipRule={shape.clipRule}
          />
        </svg>
      </motion.div>

      {/* Text content overlaid on shape — white text */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-[16%] py-[10%]"
        style={{ maxWidth: '100%' }}
      >
        {title && (
          <h3
            style={{
              fontFamily: F.title,
              fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
              fontWeight: 400,
              color: C.white,
              lineHeight: 1.1,
              marginBottom: '0.8rem',
            }}
          >
            {title}
          </h3>
        )}
        <p
          style={{
            fontFamily: F.body,
            fontSize: 'clamp(0.85rem, 1.3vw, 1.15rem)',
            color: C.white,
            opacity: 0.9,
            lineHeight: 1.5,
            whiteSpace: 'pre-line',
          }}
        >
          {content}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main ContentSlide ─────────────────────────────────────────────

export default function ContentSlide({
  slide,
  slideNum,
}: {
  slide: ContentSlideData;
  slideNum: number;
}) {
  const isDark = slide.bgMode === 'dark';
  const headingColor = isDark ? C.white : C.olive;
  const bodyColor = isDark ? 'rgba(255,255,255,0.7)' : C.olive;

  return (
    <div className="absolute inset-0 flex flex-col px-[7%] py-[5%] overflow-hidden">
      {/* Decorative face shape for dark slides */}
      {isDark && (
        <StaticOrganicShape
          shape={SHAPES.face}
          fill={C.white}
          opacity={0.07}
          floatAmp={3}
          floatDuration={14}
          style={{
            right: '-5%',
            top: '5%',
            width: '45%',
            height: '80%',
          }}
        />
      )}

      <motion.div variants={stagger} initial="hidden" animate="show" className="flex-1 flex flex-col">
        {/* Pill */}
        {slide.pill && (
          <motion.div variants={fadeUp}>
            <Pill text={slide.pill} dark={isDark} />
          </motion.div>
        )}

        {/* Heading(s) */}
        {slide.heading && (
          <motion.h1
            variants={fadeUp}
            className="mt-4"
            style={{
              fontFamily: F.title,
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 400,
              color: headingColor,
              lineHeight: 1.05,
              whiteSpace: 'pre-line',
            }}
          >
            {slide.heading}
          </motion.h1>
        )}
        {slide.heading1 && (
          <motion.h2
            variants={fadeUp}
            className="mt-3"
            style={{
              fontFamily: F.title,
              fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
              fontWeight: 400,
              color: bodyColor,
              lineHeight: 1.15,
              whiteSpace: 'pre-line',
            }}
          >
            {slide.heading1}
          </motion.h2>
        )}
        {slide.heading2 && (
          <motion.h2
            variants={fadeUp}
            className="mt-2"
            style={{
              fontFamily: F.title,
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 400,
              color: headingColor,
              lineHeight: 1.1,
              whiteSpace: 'pre-line',
            }}
          >
            {slide.heading2}
          </motion.h2>
        )}

        {/* Body text */}
        {slide.body && (
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[75%]"
            style={{
              fontFamily: slide.bodySize === 'title' ? F.title : F.body,
              fontSize: slide.bodySize === 'title'
                ? 'clamp(2.4rem, 4.5vw, 3.8rem)'
                : 'clamp(1.1rem, 1.7vw, 1.45rem)',
              color: bodyColor,
              lineHeight: slide.bodySize === 'title' ? 1.05 : 1.5,
              whiteSpace: 'pre-line',
            }}
          >
            {slide.body}
          </motion.p>
        )}

        {/* Cards — displayed as cloud/sunBlob organic shape containers */}
        {slide.cards && slide.cards.length > 0 && (
          <motion.div
            variants={fadeUp}
            className="mt-auto flex gap-4 items-stretch"
          >
            {slide.cards.map((card, i) => (
              <ShapeCard
                key={i}
                shape={CARD_SHAPES[i % CARD_SHAPES.length]}
                title={card.title}
                content={card.content}
                index={i}
              />
            ))}
          </motion.div>
        )}

        {/* Columns layout (e.g., "Notice the gap" 3-column) */}
        {slide.columns && slide.columns.length > 0 && (
          <motion.div
            variants={fadeUp}
            className="mt-auto flex gap-4 items-stretch"
          >
            {slide.columns.map((col, i) => (
              <ShapeCard
                key={i}
                shape={CARD_SHAPES[i % CARD_SHAPES.length]}
                title={col.title}
                content={col.items.join('\n')}
                index={i}
              />
            ))}
          </motion.div>
        )}

        {/* Two-column layout */}
        {slide.twoColumn && (
          <motion.div variants={fadeUp} className="flex-1 mt-4 grid grid-cols-2 gap-5">
            {/* Left */}
            <div className="rounded-xl p-8 flex flex-col" style={{ backgroundColor: C.creamDark }}>
              <h3
                style={{
                  fontFamily: F.title,
                  fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
                  fontWeight: 400,
                  color: C.olive,
                  marginBottom: '1rem',
                }}
              >
                {slide.twoColumn.left.title}
              </h3>
              {slide.twoColumn.left.items.map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: F.body,
                    fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
                    color: C.olive,
                    opacity: 0.7,
                    marginBottom: '0.6rem',
                    lineHeight: 1.4,
                  }}
                >
                  → {item}
                </p>
              ))}
              {slide.twoColumn.left.note && (
                <p
                  className="mt-auto"
                  style={{
                    fontFamily: F.body,
                    fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                    color: C.olive,
                    fontStyle: 'italic',
                    opacity: 0.5,
                  }}
                >
                  {slide.twoColumn.left.note}
                </p>
              )}
            </div>
            {/* Right */}
            <div className="rounded-xl p-8 flex flex-col" style={{ backgroundColor: C.olive }}>
              <h3
                style={{
                  fontFamily: F.title,
                  fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
                  fontWeight: 400,
                  color: C.white,
                  marginBottom: '1rem',
                }}
              >
                {slide.twoColumn.right.title}
              </h3>
              {slide.twoColumn.right.items.map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: F.body,
                    fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
                    color: C.white,
                    opacity: 0.85,
                    marginBottom: '0.6rem',
                    lineHeight: 1.4,
                  }}
                >
                  → {item}
                </p>
              ))}
              {slide.twoColumn.right.note && (
                <p
                  className="mt-auto"
                  style={{
                    fontFamily: F.body,
                    fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                    color: C.white,
                    fontStyle: 'italic',
                    opacity: 0.6,
                  }}
                >
                  {slide.twoColumn.right.note}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Quote cards */}
        {slide.quoteCards && (
          <motion.div variants={fadeUp} className="flex-1 mt-4 grid grid-cols-2 gap-4">
            {slide.quoteCards.map((quote, i) => (
              <div
                key={i}
                className="rounded-xl p-8 flex items-center"
                style={{
                  backgroundColor: i === slide.quoteCards!.length - 1 ? C.olive : C.creamDark,
                }}
              >
                <p
                  style={{
                    fontFamily: F.title,
                    fontSize: 'clamp(1.6rem, 2.2vw, 2rem)',
                    fontWeight: 400,
                    color: i === slide.quoteCards!.length - 1 ? C.white : C.olive,
                    fontStyle: 'italic',
                    lineHeight: 1.3,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {quote}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Topics list */}
        {slide.topics && (
          <motion.div variants={fadeUp} className="mt-5 space-y-4">
            {slide.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="px-5 py-3 rounded-xl shrink-0"
                  style={{ backgroundColor: C.olive, minWidth: '10rem' }}
                >
                  <span
                    style={{
                      fontFamily: F.title,
                      fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                      fontWeight: 400,
                      color: C.white,
                    }}
                  >
                    {topic.title}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: F.body,
                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                    color: C.olive,
                    lineHeight: 1.4,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {topic.description}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Bottom note */}
        {slide.note && !slide.cards && !slide.twoColumn && (
          <motion.div variants={fadeUp} className="mt-auto">
            <div
              className="rounded-xl px-6 py-4"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : C.creamDark }}
            >
              <p
                style={{
                  fontFamily: F.title,
                  fontSize: slide.noteSize === 'title'
                    ? 'clamp(2.4rem, 4.5vw, 3.8rem)'
                    : slide.noteSize === 'large'
                    ? 'clamp(2rem, 2.8vw, 2.4rem)'
                    : 'clamp(1rem, 1.4vw, 1.2rem)',
                  color: isDark ? C.white : C.olive,
                  fontStyle: 'italic',
                  lineHeight: slide.noteSize === 'title' ? 1.05 : 1.4,
                }}
              >
                {slide.note}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <SlideNumber num={slideNum} light={isDark} />
    </div>
  );
}
