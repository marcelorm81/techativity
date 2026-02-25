// ContentSlide.tsx — Content slide with organic shape containers per Figma
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { SHAPES } from '../../lib/organic-shapes';
import type { OrganicShape } from '../../lib/organic-shapes';
import { Pill, SlideNumber } from './SlideContainer';
import type { ContentSlide as ContentSlideData } from '../../data/slides-data';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Organic shapes to use as card containers (rotate through these)
const CARD_SHAPES: OrganicShape[] = [SHAPES.man, SHAPES.bird, SHAPES.sun];

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
  const floatDuration = 7 + index * 1.5;
  const phase = index * 0.3;

  return (
    <motion.div
      className="relative flex-1 flex items-center justify-center"
      style={{ minHeight: '260px' }}
      variants={fadeUp}
    >
      {/* Organic shape background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          y: [0, -3, 0, 2, 0],
          rotate: [0, 1, 0, -1, 0],
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

      {/* Text content overlaid on shape */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-[18%] py-[12%]"
        style={{ maxWidth: '100%' }}
      >
        {title && (
          <h3
            style={{
              fontFamily: F.title,
              fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)',
              fontWeight: 400,
              color: C.white,
              lineHeight: 1.1,
              marginBottom: '0.6rem',
            }}
          >
            {title}
          </h3>
        )}
        <p
          style={{
            fontFamily: F.body,
            fontSize: 'clamp(0.6rem, 1vw, 0.85rem)',
            color: C.white,
            opacity: 0.85,
            lineHeight: 1.4,
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
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
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
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
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
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
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
              fontFamily: F.body,
              fontSize: 'clamp(0.8rem, 1.3vw, 1.05rem)',
              color: bodyColor,
              lineHeight: 1.5,
              whiteSpace: 'pre-line',
            }}
          >
            {slide.body}
          </motion.p>
        )}

        {/* Cards — displayed as organic shape containers */}
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

        {/* Two-column layout */}
        {slide.twoColumn && (
          <motion.div variants={fadeUp} className="mt-auto grid grid-cols-2 gap-5">
            {/* Left */}
            <div className="rounded-xl p-6" style={{ backgroundColor: C.creamDark }}>
              <h3
                style={{
                  fontFamily: F.title,
                  fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                  fontWeight: 400,
                  color: C.olive,
                  marginBottom: '0.8rem',
                }}
              >
                {slide.twoColumn.left.title}
              </h3>
              {slide.twoColumn.left.items.map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: F.body,
                    fontSize: 'clamp(0.6rem, 0.9vw, 0.78rem)',
                    color: C.olive,
                    opacity: 0.7,
                    marginBottom: '0.35rem',
                  }}
                >
                  → {item}
                </p>
              ))}
              {slide.twoColumn.left.note && (
                <p
                  className="mt-4"
                  style={{
                    fontFamily: F.body,
                    fontSize: '0.65rem',
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
            <div className="rounded-xl p-6" style={{ backgroundColor: C.olive }}>
              <h3
                style={{
                  fontFamily: F.title,
                  fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                  fontWeight: 400,
                  color: C.white,
                  marginBottom: '0.8rem',
                }}
              >
                {slide.twoColumn.right.title}
              </h3>
              {slide.twoColumn.right.items.map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: F.body,
                    fontSize: 'clamp(0.6rem, 0.9vw, 0.78rem)',
                    color: C.white,
                    opacity: 0.8,
                    marginBottom: '0.35rem',
                  }}
                >
                  → {item}
                </p>
              ))}
              {slide.twoColumn.right.note && (
                <p
                  className="mt-4"
                  style={{
                    fontFamily: F.body,
                    fontSize: '0.65rem',
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
          <motion.div variants={fadeUp} className="mt-auto grid grid-cols-2 gap-4">
            {slide.quoteCards.map((quote, i) => (
              <div
                key={i}
                className="rounded-xl p-5 flex items-center"
                style={{
                  backgroundColor: i === slide.quoteCards!.length - 1 ? C.olive : C.creamDark,
                }}
              >
                <p
                  style={{
                    fontFamily: F.title,
                    fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)',
                    fontWeight: 400,
                    color: i === slide.quoteCards!.length - 1 ? C.white : C.olive,
                    fontStyle: 'italic',
                    lineHeight: 1.4,
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
          <motion.div variants={fadeUp} className="mt-5 space-y-3">
            {slide.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="px-4 py-2.5 rounded-xl shrink-0"
                  style={{ backgroundColor: C.olive, minWidth: '9rem' }}
                >
                  <span
                    style={{
                      fontFamily: F.title,
                      fontSize: 'clamp(0.65rem, 0.9vw, 0.78rem)',
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
                    fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)',
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
                  fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
                  color: isDark ? C.white : C.olive,
                  fontStyle: 'italic',
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
