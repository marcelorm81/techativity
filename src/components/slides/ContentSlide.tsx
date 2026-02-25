// ContentSlide.tsx — Flexible content slide renderer
import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { Pill, SlideNumber, ContentCard } from './SlideContainer';
import type { ContentSlide as ContentSlideData } from '../../data/slides-data';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function ContentSlide({
  slide,
  slideNum,
}: {
  slide: ContentSlideData;
  slideNum: number;
}) {
  const isDark = slide.bgMode === 'dark';
  const headingColor = isDark ? C.white : C.black;
  const bodyColor = isDark ? C.warmGray : C.midGray;
  const accentColor = isDark ? C.sage : C.sageDark;

  return (
    <div className="absolute inset-0 flex flex-col px-[7%] py-[6%]">
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
            className="mt-3"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
              fontWeight: 'bold',
              color: headingColor,
              lineHeight: 1.15,
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
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
              color: bodyColor,
              lineHeight: 1.2,
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
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(1.4rem, 2.3vw, 1.9rem)',
              fontWeight: 'bold',
              color: headingColor,
              lineHeight: 1.15,
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
            className="mt-4 max-w-[75%]"
            style={{
              fontFamily: "'Calibri', 'Helvetica Neue', sans-serif",
              fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
              color: /sage|olive/i.test(slide.body) ? accentColor : bodyColor,
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            {slide.body}
          </motion.p>
        )}

        {/* Cards grid */}
        {slide.cards && slide.cards.length > 0 && (
          <motion.div
            variants={fadeUp}
            className="mt-auto grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${Math.min(slide.cards.length, 3)}, 1fr)`,
            }}
          >
            {slide.cards.map((card, i) => (
              <ContentCard
                key={i}
                color={card.accent ? C.sage : isDark ? C.tagBgDark : C.sagePale}
                className="p-4"
              >
                {card.title && (
                  <h3
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: 'clamp(0.85rem, 1.3vw, 1.1rem)',
                      fontWeight: 'bold',
                      color: card.accent ? C.accentOlive : isDark ? C.sage : C.darkText,
                      marginBottom: '0.4rem',
                    }}
                  >
                    {card.title}
                  </h3>
                )}
                <p
                  style={{
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: 'clamp(0.65rem, 0.9vw, 0.78rem)',
                    color: card.accent ? C.accentOlive : isDark ? C.sage : C.midGray,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {card.content}
                </p>
              </ContentCard>
            ))}
          </motion.div>
        )}

        {/* Two-column layout */}
        {slide.twoColumn && (
          <motion.div variants={fadeUp} className="mt-auto grid grid-cols-2 gap-4">
            {/* Left */}
            <ContentCard color={C.cardBg} className="p-5">
              <h3
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
                  fontWeight: 'bold',
                  color: C.black,
                  marginBottom: '0.6rem',
                }}
              >
                {slide.twoColumn.left.title}
              </h3>
              {slide.twoColumn.left.items.map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)',
                    color: C.midGray,
                    marginBottom: '0.3rem',
                  }}
                >
                  → {item}
                </p>
              ))}
              {slide.twoColumn.left.note && (
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: '0.6rem',
                    color: C.sageDark,
                    fontStyle: 'italic',
                  }}
                >
                  {slide.twoColumn.left.note}
                </p>
              )}
            </ContentCard>
            {/* Right */}
            <ContentCard color={C.sage} className="p-5">
              <h3
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
                  fontWeight: 'bold',
                  color: C.accentOlive,
                  marginBottom: '0.6rem',
                }}
              >
                {slide.twoColumn.right.title}
              </h3>
              {slide.twoColumn.right.items.map((item, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)',
                    color: C.accentOlive,
                    marginBottom: '0.3rem',
                  }}
                >
                  → {item}
                </p>
              ))}
              {slide.twoColumn.right.note && (
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: '0.6rem',
                    color: C.accentOlive,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                  }}
                >
                  {slide.twoColumn.right.note}
                </p>
              )}
            </ContentCard>
          </motion.div>
        )}

        {/* Quote cards (2x2 grid) */}
        {slide.quoteCards && (
          <motion.div variants={fadeUp} className="mt-auto grid grid-cols-2 gap-3">
            {slide.quoteCards.map((quote, i) => (
              <ContentCard
                key={i}
                color={i === slide.quoteCards!.length - 1 ? C.sage : C.sagePale}
                className="p-4 flex items-center"
              >
                <p
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
                    color: i === slide.quoteCards!.length - 1 ? C.accentOlive : C.darkText,
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {quote}
                </p>
              </ContentCard>
            ))}
          </motion.div>
        )}

        {/* Topics list */}
        {slide.topics && (
          <motion.div variants={fadeUp} className="mt-4 space-y-2">
            {slide.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-3">
                <ContentCard color={C.sage} className="px-3 py-2 shrink-0" style={{ minWidth: '8rem' }}>
                  <span
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      color: C.accentOlive,
                    }}
                  >
                    {topic.title}
                  </span>
                </ContentCard>
                <p
                  style={{
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)',
                    color: C.darkText,
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

        {/* Bottom note/card */}
        {slide.note && !slide.cards && !slide.twoColumn && (
          <motion.div variants={fadeUp} className="mt-auto">
            <ContentCard
              color={isDark ? C.sage : C.sagePale}
              className="px-5 py-3"
            >
              <p
                style={{
                  fontFamily: isDark ? "'Georgia', serif" : "'Calibri', sans-serif",
                  fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
                  color: C.accentOlive,
                  fontStyle: 'italic',
                  fontWeight: isDark ? 'bold' : 'normal',
                }}
              >
                {slide.note}
              </p>
            </ContentCard>
          </motion.div>
        )}
      </motion.div>

      <SlideNumber num={slideNum} light={isDark} />
    </div>
  );
}
