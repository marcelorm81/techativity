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

  // Use refs to avoid stale closure issues
  const participantIdRef = useRef<string | null>(null);
  const joiningRef = useRef(false);
  const sessionRef = useRef<string | null>(sessionId);
  sessionRef.current = sessionId;

  // Subscribe to session metadata (what question is active)
  useEffect(() => {
    if (!sessionId) return;
    return subscribeToMetadata(sessionId, (meta) => {
      if (!meta) {
        // Only error if we've actually joined and aren't mid-join
        if (participantIdRef.current && !joiningRef.current) {
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

  // Join the session — accepts optional overrideSessionId for manual code entry
  const join = useCallback(
    async (name: string, role: string, overrideSessionId?: string) => {
      const sid = overrideSessionId || sessionRef.current;
      if (!sid) {
        setError('No session code provided');
        setState('error');
        return;
      }
      joiningRef.current = true;
      try {
        const exists = await sessionExists(sid);
        if (!exists) {
          setError('Session does not exist. Check the code and try again.');
          setState('error');
          joiningRef.current = false;
          return;
        }
        const pid = await joinSession(sid, name, role);
        participantIdRef.current = pid;
        setParticipantId(pid);
        setParticipantName(name);
        setParticipantRole(role);
        setState('waiting');
      } catch (e) {
        console.error('Join session error:', e);
        setError('Failed to join session. Please try again.');
        setState('error');
      } finally {
        joiningRef.current = false;
      }
    },
    []
  );

  // Submit an answer
  const submit = useCallback(
    async (text: string) => {
      const sid = sessionRef.current;
      const pid = participantIdRef.current;
      if (!sid || !pid || activeQuestion === 'none') return;
      try {
        await submitAnswer(sid, activeQuestion, pid, {
          name: participantName,
          text,
          seed: hashToSeed(participantName),
        });
        setAnsweredQuestions((prev) => new Set(prev).add(activeQuestion));
        setState('submitted');
      } catch (e) {
        console.error('Submit answer error:', e);
        setError('Failed to submit answer');
      }
    },
    [activeQuestion, participantName]
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
