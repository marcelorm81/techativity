// useSlideNavigation.ts — Keyboard navigation for slides
import { useState, useEffect, useCallback, useRef } from 'react';
import { SLIDES } from '../data/slides-data';

export function useSlideNavigation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const totalSlides = SLIDES.length;

  // Ref so the keydown handler always reads the latest slide without re-registering
  const currentSlideRef = useRef(currentSlide);
  useEffect(() => { currentSlideRef.current = currentSlide; }, [currentSlide]);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev < totalSlides - 1) {
        setDirection(1);
        return prev + 1;
      }
      return prev;
    });
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev > 0) {
        setDirection(-1);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
      }
    },
    [currentSlide, totalSlides]
  );

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // On the closing slide, arrow keys are owned by the pong game
      const isClosing = SLIDES[currentSlideRef.current]?.type === 'closing';

      switch (e.key) {
        case 'ArrowRight':
          if (isClosing) return;
          e.preventDefault();
          goNext();
          break;
        case ' ':
        case 'PageDown':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
          if (isClosing) return;
          e.preventDefault();
          goPrev();
          break;
        case 'PageUp':
          e.preventDefault();
          goPrev();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(totalSlides - 1);
          break;
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, goTo, totalSlides]);

  return {
    currentSlide,
    direction,
    totalSlides,
    goNext,
    goPrev,
    goTo,
    slide: SLIDES[currentSlide],
  };
}
