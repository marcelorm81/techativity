// AnswerForm.tsx — Submit an answer to the active question
import { useState } from 'react';
import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';

interface AnswerFormProps {
  question: 'q1' | 'q2' | 'q3';
  onSubmit: (text: string) => void;
  name: string;
}

const QUESTION_TEXT: Record<string, { label: string; prompt: string; placeholder: string }> = {
  q1: {
    label: 'Q1 — Identity',
    prompt: 'If you had to explain your job to a child, what would you say you do?',
    placeholder: 'Explain it simply…',
  },
  q2: {
    label: 'Q2 — Reality',
    prompt: 'What do you actually spend most of your time doing in a normal week?',
    placeholder: 'Be honest about your week…',
  },
  q3: {
    label: 'Q3 — Meaning',
    prompt: "At the end of a really good week, what makes you feel 'that was good work'?",
    placeholder: 'What makes it worth it…',
  },
};

export default function AnswerForm({ question, onSubmit, name }: AnswerFormProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const q = QUESTION_TEXT[question] || QUESTION_TEXT.q1;
  const maxLen = 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    await onSubmit(trimmed);
    setSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col p-6"
      style={{ backgroundColor: C.cream }}
    >
      <motion.div
        className="flex-1 flex flex-col max-w-sm mx-auto w-full pt-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Question label */}
        <motion.div
          className="inline-block self-start px-3 py-1 rounded-full mb-2"
          style={{
            backgroundColor: C.sagePale,
            fontFamily: "'Consolas', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            color: C.accentOlive,
            textTransform: 'uppercase' as const,
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          {q.label}
        </motion.div>

        {/* Question text */}
        <motion.h2
          className="mb-6"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: C.darkText,
            lineHeight: 1.3,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {q.prompt}
        </motion.h2>

        {/* Answer form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, maxLen))}
              placeholder={q.placeholder}
              autoFocus
              rows={5}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-shadow"
              style={{
                backgroundColor: C.warmWhite,
                border: `1.5px solid ${C.sageLight}`,
                fontFamily: "'Calibri', sans-serif",
                fontSize: '1rem',
                color: C.darkText,
                lineHeight: 1.5,
                minHeight: '140px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.sage;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${C.sagePale}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = C.sageLight;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {/* Character count */}
            <div className="flex justify-between mt-1.5 px-1">
              <span
                style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: '0.7rem',
                  color: C.lightGray,
                }}
              >
                as {name}
              </span>
              <span
                style={{
                  fontFamily: "'Consolas', monospace",
                  fontSize: '0.65rem',
                  color: text.length > maxLen * 0.9 ? '#c44' : C.lightGray,
                }}
              >
                {text.length}/{maxLen}
              </span>
            </div>
          </motion.div>

          {/* Submit button */}
          <motion.div
            className="mt-4 pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <motion.button
              type="submit"
              disabled={!text.trim() || submitting}
              className="w-full py-3.5 rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: text.trim() ? C.sage : C.sageLight,
                color: text.trim() ? C.white : C.warmGray,
                fontFamily: "'Calibri', sans-serif",
                fontSize: '1rem',
                border: 'none',
                cursor: text.trim() ? 'pointer' : 'default',
                opacity: submitting ? 0.7 : 1,
              }}
              whileTap={text.trim() ? { scale: 0.97 } : undefined}
            >
              {submitting ? 'Sending…' : 'Send answer'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
