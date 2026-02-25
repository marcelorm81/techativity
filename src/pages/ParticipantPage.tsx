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
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get('session');

  const {
    state,
    participantName,
    activeQuestion,
    error,
    join,
    submit,
  } = useParticipantSession(sessionId);

  const handleJoin = async (name: string, role: string, sessionCode?: string) => {
    const sid = sessionCode?.toUpperCase() || undefined;
    // If a manual code was entered, update the URL so subscriptions pick it up
    if (sid) {
      setSearchParams({ session: sid });
    }
    await join(name, role, sid);
  };

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
          <JoinForm
            onJoin={handleJoin}
            error={error}
            showSessionCode={!sessionId}
          />
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
              fontFamily: "'Gambarino', 'Georgia', serif",
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
              fontFamily: "'Gambarino', 'Georgia', serif",
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
              fontFamily: "'Gambarino', 'Georgia', serif",
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
