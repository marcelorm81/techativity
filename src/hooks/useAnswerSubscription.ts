// useAnswerSubscription.ts — Real-time answer listener via Firebase
import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToAnswers,
  type AnswerData,
} from '../lib/firebase';
import { hashToSeed } from '../lib/blob-generator';

export interface Answer {
  id: string;
  name: string;
  text: string;
  timestamp: number;
  seed: number;
}

export type QuestionKey = 'q1' | 'q2' | 'q3' | 'q4';

interface AnswerState {
  q1: Answer[];
  q2: Answer[];
  q3: Answer[];
  q4: Answer[];
}

function toAnswers(data: Record<string, AnswerData>): Answer[] {
  return Object.entries(data).map(([id, d]) => ({
    id,
    name: d.name,
    text: d.text,
    timestamp: typeof d.timestamp === 'number' ? d.timestamp : Date.now(),
    seed: d.seed || hashToSeed(d.name),
  }));
}

export function useAnswerSubscription(sessionId?: string) {
  const [answers, setAnswers] = useState<AnswerState>({
    q1: [],
    q2: [],
    q3: [],
    q4: [],
  });

  useEffect(() => {
    if (!sessionId) return;

    const unsubs: (() => void)[] = [];

    for (const q of ['q1', 'q2', 'q3', 'q4'] as const) {
      const unsub = subscribeToAnswers(sessionId, q, (data) => {
        setAnswers((prev) => ({
          ...prev,
          [q]: toAnswers(data),
        }));
      });
      unsubs.push(unsub);
    }

    return () => unsubs.forEach((u) => u());
  }, [sessionId]);

  const getAnswers = useCallback(
    (key: QuestionKey): Answer[] => answers[key],
    [answers]
  );

  // For local testing without Firebase
  const addTestAnswer = useCallback(
    (key: QuestionKey, name: string, text: string) => {
      setAnswers((prev) => ({
        ...prev,
        [key]: [
          ...prev[key],
          {
            id: `${key}-${Date.now()}`,
            name,
            text,
            timestamp: Date.now(),
            seed: hashToSeed(name),
          },
        ],
      }));
    },
    []
  );

  return { answers, getAnswers, addTestAnswer };
}
