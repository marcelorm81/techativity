// useParticipantSession.ts — Participant joins and submits answers
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [participantRole, setParticipantRole] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<
    'none' | 'q1' | 'q2' | 'q3'
  >('none');
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);

  // Track the effective session ID (may come from prop or from join call)
  const effectiveSessionRef = useRef<string | null>(sessionId);
  effectiveSessionRef.current = sessionId;

  // Subscribe to session metadata (what question is active)
  useEffect(() => {
    if (!sessionId) return;
    return subscribeToMetadata(sessionId, (meta) => {
      if (!meta) {
        // Only show error if we've already joined (not during initial load with no session)
        if (participantId) {
          setError('Session not found');
          setState('error');
        }
        return;
      }
      setActiveQuestion(meta.activeQuestion);

      if (meta.status === 'closed') {
        setState('complete');
      }
    });
  }, [sessionId, participantId]);

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

  // Join the session — accepts optional overrideSessionId for manual code entry
  const join = useCallback(
    async (name: string, role: string, overrideSessionId?: string) => {
      const sid = overrideSessionId || effectiveSessionRef.current;
      if (!sid) return;
      try {
        const exists = await sessionExists(sid);
        if (!exists) {
          setError('Session does not exist');
          setState('error');
          return;
        }
        const pid = await joinSession(sid, name, role);
        setParticipantId(pid);
        setParticipantName(name);
        setParticipantRole(role);
        setState('waiting');
      } catch (e) {
        setError('Failed to join session');
        setState('error');
      }
    },
    []
  );

  // Submit an answer
  const submit = useCallback(
    async (text: string) => {
      const sid = effectiveSessionRef.current;
      if (!sid || !participantId || activeQuestion === 'none') return;
      try {
        await submitAnswer(sid, activeQuestion, participantId, {
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
    [participantId, activeQuestion, participantName]
  );

  return {
    state,
    participantId,
    participantName,
    participantRole,
    activeQuestion,
    answeredQuestions,
    error,
    join,
    submit,
  };
}
