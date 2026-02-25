// ParticipantPage.tsx — Mobile participant flow
// Join → Wait → Answer Q1 → Wait → Answer Q2 → Wait → Answer Q3 → Thank You
import { useSearchParams } from 'react-router-dom';
import { useParticipantSession } from '../hooks/useParticipantSession';
import JoinForm from '../components/participant/JoinForm';
import WaitingScreen from '../components/participant/WaitingScreen';
import AnswerForm from '../components/participant/AnswerForm';
import ThankYou from '../components/participant/ThankYou';
import { C } from '../lib/design-system';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParticipantPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');

  const {
    state,
    participantName,
    activeQuestion,
    error,
    join,
    submit,
  } = useParticipantSession(sessionId);

  // No session ID in URL
  if (!sessionId) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: C.cream }}
      >
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: C.darkText,
            textAlign: 'center',
          }}
        >
          No session found
        </h1>
        <p
          className="mt-3"
          style={{
            fontFamily: "'Calibri', sans-serif",
            fontSize: '0.85rem',
            color: C.midGray,
            textAlign: 'center',
          }}
        >
          Scan the QR code on the presenter's screen to join.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {state === 'joining' && (
        <motion.div
          key="join"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <JoinForm onJoin={join} error={error} />
        </motion.div>
      )}

      {state === 'waiting' && (
        <motion.div
          key="waiting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <WaitingScreen name={participantName} />
        </motion.div>
      )}

      {state === 'answering' && activeQuestion !== 'none' && (
        <motion.div
          key={`answer-${activeQuestion}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
        >
          <AnswerForm
            question={activeQuestion}
            onSubmit={submit}
            name={participantName}
          />
        </motion.div>
      )}

      {state === 'submitted' && (
        <motion.div
          key="submitted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <WaitingScreen
            name={participantName}
            message="Answer recorded — waiting for the next question…"
          />
        </motion.div>
      )}

      {state === 'complete' && (
        <motion.div
          key="complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ThankYou name={participantName} />
        </motion.div>
      )}

      {state === 'error' && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex flex-col items-center justify-center p-6"
          style={{ backgroundColor: C.cream }}
        >
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: C.darkText,
              textAlign: 'center',
            }}
          >
            Something went wrong
          </h2>
          <p
            className="mt-3"
            style={{
              fontFamily: "'Calibri', sans-serif",
              fontSize: '0.85rem',
              color: '#c44',
              textAlign: 'center',
            }}
          >
            {error || 'Unable to connect to the session.'}
          </p>
          <button
            className="mt-5 px-5 py-2 rounded-lg"
            style={{
              backgroundColor: C.sage,
              color: C.white,
              fontFamily: "'Calibri', sans-serif",
              fontSize: '0.85rem',
              border: 'none',
            }}
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
