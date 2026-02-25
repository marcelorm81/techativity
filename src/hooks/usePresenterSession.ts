// usePresenterSession.ts — Presenter creates and controls a session
import { useState, useEffect, useCallback } from 'react';
import {
  createSession,
  updateSessionMetadata,
  subscribeToParticipants,
  type Participant,
  type SessionMetadata,
} from '../lib/firebase';

export function usePresenterSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Record<string, Participant>>({});
  const [isCreating, setIsCreating] = useState(false);

  // Create a new session
  const startSession = useCallback(async () => {
    setIsCreating(true);
    try {
      const id = await createSession();
      setSessionId(id);
      return id;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Subscribe to participants
  useEffect(() => {
    if (!sessionId) return;
    return subscribeToParticipants(sessionId, setParticipants);
  }, [sessionId]);

  // Update active question
  const activateQuestion = useCallback(
    async (q: 'none' | 'q1' | 'q2' | 'q3') => {
      if (!sessionId) return;
      await updateSessionMetadata(sessionId, {
        activeQuestion: q,
        status: 'live',
      });
    },
    [sessionId]
  );

  // Update current slide
  const updateSlide = useCallback(
    async (slideIndex: number) => {
      if (!sessionId) return;
      await updateSessionMetadata(sessionId, { currentSlide: slideIndex });
    },
    [sessionId]
  );

  // Close session
  const closeSession = useCallback(async () => {
    if (!sessionId) return;
    await updateSessionMetadata(sessionId, {
      activeQuestion: 'none',
      status: 'closed',
    });
  }, [sessionId]);

  return {
    sessionId,
    participants,
    participantCount: Object.keys(participants).length,
    isCreating,
    startSession,
    activateQuestion,
    updateSlide,
    closeSession,
  };
}
