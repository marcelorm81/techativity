// useParticipantSession.ts — Participant joins and submits answers
import { useState, useEffect, useCallback } from 'react';
import {
  joinSession,
  submitAnswer,
  subscribeToMetadata,
  sessionExists,
  type SessionMetadata,
} from '../lib/firebase';
import { hashToSeed } from '../lib/blob-generator';

export type ParticipantState =
  | 'joining'
  | 'waiting'
  | 'answering'
  | 'submitted'
  | 'complete'
  | 'error';

export function useParticipantSession(sessionId: string | null) {
  const [state, setState] = useState<ParticipantState>('joining');
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<
    'none' | 'q1' | 'q2' | 'q3'
  >('none');
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);

  // Subscribe to session metadata (what question is active)
  useEffect(() => {
    if (!sessionId) return;
    return subscribeToMetadata(sessionId, (meta) => {
      if (!meta) {
        setError('Session not found');
        setState('error');
        return;
      }
      setActiveQuestion(meta.activeQuestion);

      if (meta.status === 'closed') {
        setState('complete');
      }
    });
  }, [sessionId]);

  // Update state based on active question changes
  useEffect(() => {
    if (!participantId) return;

    if (activeQuestion === 'none') {
      if (answeredQuestions.size >= 3) {
        setState('complete');
      } else {
        setState('waiting');
      }
    } else if (answeredQuestions.has(activeQuestion)) {
      setState('submitted');
    } else {
      setState('answering');
    }
  }, [activeQuestion, participantId, answeredQuestions]);

  // Join the session
  const join = useCallback(
    async (name: string) => {
      if (!sessionId) return;
      try {
        const exists = await sessionExists(sessionId);
        if (!exists) {
          setError('Session does not exist');
          setState('error');
          return;
        }
        const pid = await joinSession(sessionId, name);
        setParticipantId(pid);
        setParticipantName(name);
        setState('waiting');
      } catch (e) {
        setError('Failed to join session');
        setState('error');
      }
    },
    [sessionId]
  );

  // Submit an answer
  const submit = useCallback(
    async (text: string) => {
      if (!sessionId || !participantId || activeQuestion === 'none') return;
      try {
        await submitAnswer(sessionId, activeQuestion, participantId, {
          name: participantName,
          text,
          seed: hashToSeed(participantName),
        });
        setAnsweredQuestions((prev) => new Set(prev).add(activeQuestion));
        setState('submitted');
      } catch (e) {
        setError('Failed to submit answer');
      }
    },
    [sessionId, participantId, activeQuestion, participantName]
  );

  return {
    state,
    participantId,
    participantName,
    activeQuestion,
    answeredQuestions,
    error,
    join,
    submit,
  };
}
