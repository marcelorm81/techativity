// firebase.ts — Firebase Realtime Database setup
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update,
  get,
  serverTimestamp,
  type Database,
} from 'firebase/database';

// ─── Firebase config ────────────────────────────────────────────────
// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDEMO_KEY_REPLACE_ME',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'techativity-live.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://techativity-live-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'techativity-live',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'techativity-live.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
export const db: Database = getDatabase(app);

// ─── Database paths ─────────────────────────────────────────────────
export const paths = {
  session: (id: string) => `sessions/${id}`,
  metadata: (id: string) => `sessions/${id}/metadata`,
  answers: (id: string, q: string) => `sessions/${id}/answers/${q}`,
  participants: (id: string) => `sessions/${id}/participants`,
  participant: (id: string, pid: string) => `sessions/${id}/participants/${pid}`,
};

// ─── Session management ─────────────────────────────────────────────

export interface SessionMetadata {
  activeQuestion: 'none' | 'q1' | 'q2' | 'q3';
  status: 'setup' | 'live' | 'closed';
  currentSlide: number;
  createdAt: unknown; // serverTimestamp
}

export async function createSession(): Promise<string> {
  // Generate a short session ID (6 chars)
  const id = Math.random().toString(36).substring(2, 8).toUpperCase();
  const sessionRef = ref(db, paths.metadata(id));
  await set(sessionRef, {
    activeQuestion: 'none',
    status: 'setup',
    currentSlide: 0,
    createdAt: serverTimestamp(),
  });
  return id;
}

export async function updateSessionMetadata(
  sessionId: string,
  data: Partial<SessionMetadata>
) {
  const metaRef = ref(db, paths.metadata(sessionId));
  await update(metaRef, data);
}

export function subscribeToMetadata(
  sessionId: string,
  callback: (meta: SessionMetadata | null) => void
) {
  const metaRef = ref(db, paths.metadata(sessionId));
  return onValue(metaRef, (snapshot) => {
    callback(snapshot.val());
  });
}

// ─── Participant management ─────────────────────────────────────────

export interface Participant {
  name: string;
  joinedAt: unknown;
}

export async function joinSession(
  sessionId: string,
  name: string
): Promise<string> {
  const participantsRef = ref(db, paths.participants(sessionId));
  const newRef = push(participantsRef);
  await set(newRef, {
    name,
    joinedAt: serverTimestamp(),
  });
  return newRef.key!;
}

export function subscribeToParticipants(
  sessionId: string,
  callback: (participants: Record<string, Participant>) => void
) {
  const partRef = ref(db, paths.participants(sessionId));
  return onValue(partRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
}

// ─── Answer management ──────────────────────────────────────────────

export interface AnswerData {
  name: string;
  text: string;
  timestamp: unknown;
  seed: number;
}

export async function submitAnswer(
  sessionId: string,
  question: 'q1' | 'q2' | 'q3',
  participantId: string,
  data: { name: string; text: string; seed: number }
) {
  const answerRef = ref(
    db,
    `${paths.answers(sessionId, question)}/${participantId}`
  );
  await set(answerRef, {
    ...data,
    timestamp: serverTimestamp(),
  });
}

export function subscribeToAnswers(
  sessionId: string,
  question: 'q1' | 'q2' | 'q3',
  callback: (answers: Record<string, AnswerData>) => void
) {
  const answersRef = ref(db, paths.answers(sessionId, question));
  return onValue(answersRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
}

// ─── Check if session exists ────────────────────────────────────────

export async function sessionExists(sessionId: string): Promise<boolean> {
  const metaRef = ref(db, paths.metadata(sessionId));
  const snapshot = await get(metaRef);
  return snapshot.exists();
}
