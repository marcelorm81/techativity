// PresenterPage.tsx — Desktop 16:9 presenter view with session controls
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlideNavigation } from '../hooks/useSlideNavigation';
import { useAnswerSubscription } from '../hooks/useAnswerSubscription';
import { usePresenterSession } from '../hooks/usePresenterSession';
import SlideRenderer from '../components/slides/SlideRenderer';
import TechativityLogo from '../components/TechativityLogo';
import { StaticOrganicShape } from '../components/common/MorphingShape';
import { SHAPES } from '../lib/organic-shapes';
import { SLIDES } from '../data/slides-data';
import { QRCodeSVG } from 'qrcode.react';
import { C, F } from '../lib/design-system';

// Determine which question slides map to which question key
function getQuestionKeyForSlide(slideIndex: number): 'q1' | 'q2' | 'q3' | 'q4' | null {
  const slide = SLIDES[slideIndex];
  if (!slide) return null;
  // Question activation on the question slide itself
  if (slide.type === 'question') {
    const qNum = (slide as any).questionNumber;
    if (qNum >= 1 && qNum <= 4) return `q${qNum}` as 'q1' | 'q2' | 'q3' | 'q4';
    // Q4 doesn't have questionNumber, use theme to detect it
    const theme = (slide as any).theme;
    if (theme === 'clarity') return 'q4';
  }
  // Also activate on the answers slide
  if (slide.type === 'answers') {
    const qNum = (slide as any).questionNumber;
    if (qNum >= 1 && qNum <= 4) return `q${qNum}` as 'q1' | 'q2' | 'q3' | 'q4';
  }
  return null;
}

export default function PresenterPage() {
  const { currentSlide, direction, totalSlides, slide, goNext, goPrev, goTo } =
    useSlideNavigation();
  const {
    sessionId,
    participantCount,
    isCreating,
    startSession,
    loadSession,
    activateQuestion,
    updateSlide,
    closeSession,
  } = usePresenterSession();
  const { answers, addTestAnswer } = useAnswerSubscription(sessionId ?? undefined);

  const [showSetup, setShowSetup] = useState(true);
  const [activeQ, setActiveQ] = useState<'none' | 'q1' | 'q2' | 'q3' | 'q4'>('none');
  const [reviewCode, setReviewCode] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(false);

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

  // Review a past session by code
  const handleReview = async () => {
    const code = reviewCode.trim().toUpperCase();
    if (!code) return;
    setReviewLoading(true);
    setReviewError(false);
    const found = await loadSession(code);
    setReviewLoading(false);
    if (found) {
      setShowSetup(false);
    } else {
      setReviewError(true);
    }
  };

  // ── Setup screen ───────────────────────────────────────────────────
  if (showSetup) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: C.darkBg, position: 'relative' }}
      >
        {/* Background organic shapes — subtle, low opacity */}
        <StaticOrganicShape shape={SHAPES.cloud} fill={C.white} opacity={0.04} floatAmp={6} floatDuration={12}
          style={{ left: '-8%', top: '-10%', width: '35%', height: '50%' }} />
        <StaticOrganicShape shape={SHAPES.sunBlob} fill={C.white} opacity={0.04} floatAmp={5} floatDuration={14} phase={0.3}
          style={{ right: '-6%', top: '-5%', width: '30%', height: '45%' }} />
        <StaticOrganicShape shape={SHAPES.bird} fill={C.white} opacity={0.035} floatAmp={4} floatDuration={11} phase={0.6}
          style={{ left: '-5%', bottom: '-12%', width: '28%', height: '40%' }} />
        <StaticOrganicShape shape={SHAPES.mountain} fill={C.white} opacity={0.035} floatAmp={5} floatDuration={13} phase={0.8}
          style={{ right: '-4%', bottom: '-8%', width: '25%', height: '35%' }} />
        <StaticOrganicShape shape={SHAPES.man} fill={C.white} opacity={0.025} floatAmp={3} floatDuration={15} phase={0.5}
          style={{ left: '30%', top: '-15%', width: '40%', height: '35%' }} />

        {/* Main content — centered */}
        <motion.div
          className="flex flex-col items-center text-center relative"
          style={{ zIndex: 1, width: '100%', maxWidth: '75vw' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Large TECHATIVITY SVG wordmark */}
          <TechativityLogo
            color={C.white}
            width="100%"
            className="mb-8"
          />

          {/* Buttons below — matching Figma */}
          <AnimatePresence mode="wait">
            {!sessionId ? (
              <motion.div
                key="start-buttons"
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.button
                  onClick={handleStart}
                  disabled={isCreating}
                  className="px-10 py-3 rounded-full"
                  style={{
                    backgroundColor: 'transparent',
                    color: C.white,
                    fontFamily: F.title,
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                    border: `1.5px solid rgba(255,255,255,0.5)`,
                    cursor: isCreating ? 'wait' : 'pointer',
                    opacity: isCreating ? 0.7 : 1,
                  }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.8)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isCreating ? 'Creating session…' : 'Start Live session'}
                </motion.button>

                <motion.button
                  onClick={handleSkipSetup}
                  className="px-6 py-2"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'rgba(255,255,255,0.45)',
                    fontFamily: F.title,
                    fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  whileHover={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Present Offline (no Q&A)
                </motion.button>

                {/* Review past session */}
                <div className="flex flex-col items-center mt-6" style={{ gap: '0.5rem' }}>
                  <p style={{
                    fontFamily: F.body,
                    fontSize: 'clamp(0.65rem, 0.85vw, 0.75rem)',
                    color: 'rgba(255,255,255,0.28)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>
                    Review past session
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={reviewCode}
                      onChange={e => { setReviewCode(e.target.value.toUpperCase()); setReviewError(false); }}
                      onKeyDown={e => e.key === 'Enter' && handleReview()}
                      placeholder="SESSION CODE"
                      maxLength={6}
                      style={{
                        fontFamily: F.title,
                        fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                        background: 'rgba(255,255,255,0.07)',
                        border: reviewError ? '1.5px solid rgba(255,100,100,0.5)' : '1.5px solid rgba(255,255,255,0.18)',
                        borderRadius: '0.5rem',
                        color: C.white,
                        padding: '0.4rem 0.75rem',
                        width: '9rem',
                        letterSpacing: '0.12em',
                        outline: 'none',
                        textAlign: 'center',
                      }}
                    />
                    <motion.button
                      onClick={handleReview}
                      disabled={reviewLoading || reviewCode.trim().length === 0}
                      style={{
                        fontFamily: F.title,
                        fontSize: 'clamp(0.75rem, 0.95vw, 0.85rem)',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1.5px solid rgba(255,255,255,0.22)',
                        borderRadius: '0.5rem',
                        color: 'rgba(255,255,255,0.7)',
                        padding: '0.4rem 0.9rem',
                        cursor: reviewLoading || reviewCode.trim().length === 0 ? 'not-allowed' : 'pointer',
                        opacity: reviewCode.trim().length === 0 ? 0.4 : 1,
                      }}
                      whileHover={reviewCode.trim().length > 0 ? { scale: 1.04 } : {}}
                      whileTap={reviewCode.trim().length > 0 ? { scale: 0.97 } : {}}
                    >
                      {reviewLoading ? '…' : 'Review'}
                    </motion.button>
                  </div>
                  {reviewError && (
                    <p style={{
                      fontFamily: F.body,
                      fontSize: 'clamp(0.6rem, 0.75vw, 0.68rem)',
                      color: 'rgba(255,120,120,0.7)',
                    }}>
                      Session not found
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="session-info"
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-end gap-5">
                  <div className="flex flex-col items-center">
                    <div
                      className="p-3 rounded-2xl"
                      style={{ backgroundColor: C.white }}
                    >
                      <QRCodeSVG
                        value={joinUrl}
                        size={140}
                        bgColor={C.white}
                        fgColor={C.olive}
                        level="M"
                      />
                    </div>
                    <p
                      className="mt-2"
                      style={{
                        fontFamily: F.title,
                        fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      Session: {sessionId}
                    </p>
                    <p
                      className="mt-1"
                      style={{
                        fontFamily: F.title,
                        fontSize: 'clamp(0.8rem, 1vw, 0.95rem)',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {participantCount} participant{participantCount !== 1 ? 's' : ''} joined
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => setShowSetup(false)}
                  className="mt-5 px-10 py-3 rounded-full"
                  style={{
                    backgroundColor: 'transparent',
                    color: C.white,
                    fontFamily: F.title,
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                    border: `1.5px solid rgba(255,255,255,0.5)`,
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Begin presentation
                </motion.button>
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
            sessionInfo={sessionId ? { sessionId, joinUrl, participantCount } : null}
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
            fontFamily: "'Gambarino', 'Georgia', serif",
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
              fontFamily: "'Gambarino', 'Georgia', serif",
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
              fontFamily: "'Gambarino', 'Georgia', serif",
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
          style={{ color: C.warmGray, fontFamily: "'Gambarino', 'Georgia', serif", fontSize: '0.6rem' }}
        >
          ←
        </button>
        <button
          onClick={goNext}
          disabled={currentSlide === totalSlides - 1}
          className="px-2 py-1 rounded text-xs disabled:opacity-30"
          style={{ color: C.warmGray, fontFamily: "'Gambarino', 'Georgia', serif", fontSize: '0.6rem' }}
        >
          →
        </button>

        {/* Keyboard hint */}
        <span
          style={{
            fontFamily: "'Gambarino', 'Georgia', serif",
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
