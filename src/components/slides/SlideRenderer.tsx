// SlideRenderer.tsx — Maps slide data to the correct component
import SlideContainer, { type TransitionStyle } from './SlideContainer';
import TitleSlide from './TitleSlide';
import SectionDivider from './SectionDivider';
import StatementSlide from './StatementSlide';
import QuestionSlide from './QuestionSlide';
import ContentSlide from './ContentSlide';
import ClosingSlide from './ClosingSlide';
import AnswersSlide from './AnswersSlide';
import type { Slide } from '../../data/slides-data';
import type { Answer } from '../../hooks/useAnswerSubscription';

export interface SessionInfo {
  sessionId: string;
  joinUrl: string;
  participantCount: number;
}

interface SlideRendererProps {
  slide: Slide;
  slideIndex: number;
  direction: number;
  answers?: {
    q1: Answer[];
    q2: Answer[];
    q3: Answer[];
  };
  sessionInfo?: SessionInfo | null;
}

// Choose transition style based on slide type
function getTransition(slide: Slide): TransitionStyle {
  switch (slide.type) {
    case 'title':
      return 'scale';
    case 'section':
      return 'slide';
    case 'statement':
      return 'scale';
    case 'question':
      return 'fade';
    case 'answers':
      return 'dramatic';
    case 'closing':
      return 'scale';
    default:
      return 'slide';
  }
}

export default function SlideRenderer({
  slide,
  slideIndex,
  direction,
  answers,
  sessionInfo,
}: SlideRendererProps) {
  function renderSlide() {
    switch (slide.type) {
      case 'title':
        return <TitleSlide slide={slide} sessionInfo={sessionInfo} />;
      case 'section':
        return <SectionDivider slide={slide} />;
      case 'statement':
        return <StatementSlide slide={slide} />;
      case 'question':
        return <QuestionSlide slide={slide} />;
      case 'answers': {
        const qKey = `q${slide.questionNumber}` as 'q1' | 'q2' | 'q3';
        return (
          <AnswersSlide
            slide={slide}
            answers={answers?.[qKey] || []}
          />
        );
      }
      case 'content':
        return <ContentSlide slide={slide} slideNum={slideIndex + 1} />;
      case 'closing':
        return <ClosingSlide slide={slide} />;
      default:
        return <div>Unknown slide type</div>;
    }
  }

  return (
    <SlideContainer
      bgMode={slide.bgMode}
      slideIndex={slideIndex}
      direction={direction}
      transition={getTransition(slide)}
    >
      {renderSlide()}
    </SlideContainer>
  );
}
