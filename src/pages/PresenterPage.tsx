// PresenterPage.tsx — Desktop 16:9 presenter view with session controls
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideNavigation } from '../hooks/useSlideNavigation';
import { useAnswerSubscription } from '../hooks/useAnswerSubscription';
import { usePresenterSession } from '../hooks/usePresenterSession';
import SlideRenderer from '../components/slides/SlideRenderer';
import { SLIDES } from '../data/slides-data';
import { QRCodeSVG } from 'qrcode.react';
import { C } from '../lib/design-system';

// Determine which question slides map to which question key
function getQuestionKeyForSlide(slideIndex: number): 'q1' | 'q2' | 'q3' | null {
  const slide = SLIDES[slideIndex];
  if (!slide) return null;
  // Question activation on the question slide itself
  if (slide.type === 'question') {
    const qNum = (slide as any).questionNumber;
    if (qNum >= 1 && qNum <= 3) return `q${qNum}` as 'q1' | 'q2' | 'q3';
  }
  // Also activate on the answers slide
  if (slide.type === 'answers') {
    const qNum = (slide as any).questionNumber;
    if (qNum >= 1 && qNum <= 3) return `q${qNum}` as 'q1' | 'q2' | 'q3';
  }
  return null;
}

export default function PresenterPage() {
  const { currentSlide, direction, totalSlides, slide, goNext, goPrev, goTo } =
    useSlideNavigation();
  const { answers, addTestAnswer } = useAnswerSubscription();
  const {
    sessionId,
    participantCount,
    isCreating,
    startSession,
    activateQuestion,
    updateSlide,
    closeSession,
  } = usePresenterSession();

  const [showSetup, setShowSetup] = useState(true);
  const [activeQ, setActiveQ] = useState<'none' | 'q1' | 'q2' | 'q3'>('none');

  // Build join URL
  const joinUrl = useMemo(() => {
    if (!sessionId) return '';
    const base = window.location.origin;
    return `${base}/join?session=${sessionId}`;
  }, [sessionId]);

  // Auto-activate/deactivate questions based on current slide
  useEffect(() => {
    const qKey = getQuestionKeyForSlide(currentSlide);
    if (qKey && qKey !== activeQ) {
      setActiveQ(qKey);
      if (sessionId) activateQuestion(qKey);
    } else if (!qKey && activeQ !== 'none') {
      setActiveQ('none');
      if (sessionId) activateQuestion('none');
    }
  }, [currentSlide, sessionId]);

  // Sync slide index to Firebase
  useEffect(() => {
    if (sessionId) updateSlide(currentSlide);
  }, [currentSlide, sessionId]);

  // Keyboard: T to add test answer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        const qKey = getQuestionKeyForSlide(currentSlide);
        if (qKey) {
          const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi',
            'Ivan', 'Judy', 'Karl', 'Liam', 'Maya', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rosa'];
          const testTexts = [
            'My curiosity defines me more than any skill',
            'The belief that productivity equals worth',
            'Knowing my work helps someone think differently',
            'I am the questions I keep asking',
            'That we need to be constantly improving',
            'Creating something that outlasts the moment',
            'My background in music shapes how I code',
            'The assumption that expertise comes from credentials',
            'Seeing ideas I planted grow in unexpected places',
          ];
          const existing = answers[qKey].length;
          const name = names[existing % names.length];
          const text = testTexts[existing % testTexts.length];
          addTestAnswer(qKey, name, text);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentSlide, answers, addTestAnswer]);

  // Handle start session
  const handleStart = async () => {
    await startSession();
    setShowSetup(false);
  };

  // Skip setup (offline mode)
  const handleSkipSetup = () => {
    setShowSetup(false);
  };

  // ── Setup screen ───────────────────────────────────────────────────
  if (showSetup) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center"
        style={{ backgroundColor: C.darkBg }}
      >
        <motion.div
          className="flex flex-col items-center max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: '2rem',
              fontWeight: 'bold',
              color: C.white,
            }}
          >
            Techativity
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Calibri', sans-serif",
              fontSize: '0.9rem',
              color: C.warmGray,
            }}
          >
            Live interactive presentation
          </p>

          <div className="flex flex-col gap-3 mt-8 w-full">
            <motion.button
              onClick={handleStart}
              disabled={isCreating}
              className="w-full py-3 rounded-xl font-semibold"
              style={{
                backgroundColor: C.sage,
                color: C.white,
                fontFamily: "'Calibri', sans-serif",
                fontSize: '1rem',
                border: 'none',
                opacity: isCreating ? 0.7 : 1,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCreating ? 'Creating session…' : 'Start Live Session'}
            </motion.button>

            <button
              onClick={handleSkipSetup}
              className="py-2 rounded-lg"
              style={{
                backgroundColor: 'transparent',
                color: C.warmGray,
                fontFamily: "'Consolas', monospace",
                fontSize: '0.75rem',
                border: `1px solid ${C.warmGray}30`,
              }}
            >
              Present offline (no Q&A)
            </button>
          </div>

          {/* QR code if session created */}
          <AnimatePresence>
            {sessionId && (
              <motion.div
                className="mt-8 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: C.white }}
                >
                  <QRCodeSVG
                    value={joinUrl}
                    size={180}
                    bgColor={C.white}
                    fgColor={C.black}
                    level="M"
                  />
                </div>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: "'Consolas', monospace",
                    fontSize: '0.65rem',
                    color: C.sage,
                  }}
                >
                  Session: {sessionId}
                </p>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: '0.8rem',
                    color: C.warmGray,
                  }}
                >
                  {participantCount} participant{participantCount !== 1 ? 's' : ''} joined
                </p>
                <button
                  onClick={() => setShowSetup(false)}
                  className="mt-4 px-6 py-2 rounded-lg font-semibold"
                  style={{
                    backgroundColor: C.sage,
                    color: C.white,
                    fontFamily: "'Calibri', sans-serif",
                    fontSize: '0.85rem',
                    border: 'none',
                  }}
                >
                  Begin presentation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // ── Presentation mode ──────────────────────────────────────────────
  const currentQKey = getQuestionKeyForSlide(currentSlide);
  const answerCount = currentQKey ? answers[currentQKey].length : 0;

  return (
    <div
      className="h-screen w-screen flex flex-col"
      style={{ backgroundColor: C.black }}
    >
      {/* Slide area — maintains 16:9 */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div
          className="relative"
          style={{
            width: 'min(100vw, 177.78vh)',
            height: 'min(56.25vw, 100vh)',
          }}
        >
          <SlideRenderer
            slide={slide}
            slideIndex={currentSlide}
            direction={direction}
            answers={answers}
          />
        </div>
      </div>

      {/* Control bar */}
      <div
        className="h-10 flex items-center px-4 gap-3 shrink-0"
        style={{ backgroundColor: C.darkBg }}
      >
        {/* Slide counter */}
        <span
          style={{
            fontFamily: "'Consolas', monospace",
            fontSize: '0.6rem',
            color: C.warmGray,
          }}
        >
          {currentSlide + 1}/{totalSlides}
        </span>

        {/* Progress bar */}
        <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: '#333' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: C.sage,
              width: `${((currentSlide + 1) / totalSlides) * 100}%`,
            }}
          />
        </div>

        {/* Session info */}
        {sessionId && (
          <span
            style={{
              fontFamily: "'Consolas', monospace",
              fontSize: '0.55rem',
              color: C.sage,
            }}
          >
            {sessionId} · {participantCount}p
          </span>
        )}

        {/* Active Q indicator */}
        {currentQKey && (
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: C.sage + '30',
              fontFamily: "'Consolas', monospace",
              fontSize: '0.55rem',
              color: C.sage,
            }}
          >
            {currentQKey.toUpperCase()} · {answerCount} answers
          </span>
        )}

        {/* Nav buttons */}
        <button
          onClick={goPrev}
          disabled={currentSlide === 0}
          className="px-2 py-1 rounded text-xs disabled:opacity-30"
          style={{ color: C.warmGray, fontFamily: "'Consolas', monospace", fontSize: '0.6rem' }}
        >
          ←
        </button>
        <button
          onClick={goNext}
          disabled={currentSlide === totalSlides - 1}
          className="px-2 py-1 rounded text-xs disabled:opacity-30"
          style={{ color: C.warmGray, fontFamily: "'Consolas', monospace", fontSize: '0.6rem' }}
        >
          →
        </button>

        {/* Keyboard hint */}
        <span
          style={{
            fontFamily: "'Consolas', monospace",
            fontSize: '0.5rem',
            color: '#444',
          }}
        >
          ←→ space{currentQKey ? ' | T=test' : ''}
        </span>
      </div>
    </div>
  );
}
