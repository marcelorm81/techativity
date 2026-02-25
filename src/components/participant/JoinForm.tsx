// JoinForm.tsx — Participant name + role entry screen (+ optional session code)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { blobPath } from '../../lib/blob-generator';

interface JoinFormProps {
  onJoin: (name: string, role: string, sessionCode?: string) => void;
  error?: string | null;
  showSessionCode?: boolean;
}

// Decorative background blob paths
const bgBlob1 = blobPath(50, 50, 42, { seed: 201, points: 9, wobble: 0.3 });
const bgBlob2 = blobPath(50, 50, 35, { seed: 202, points: 7, wobble: 0.25 });

const inputStyle = {
  backgroundColor: C.warmWhite,
  border: `1.5px solid ${C.sageLight}`,
  fontFamily: "'Calibri', sans-serif",
  fontSize: '1rem',
  color: C.darkText,
};

function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = C.sage;
  e.target.style.boxShadow = `0 0 0 3px ${C.sagePale}`;
}

function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = C.sageLight;
  e.target.style.boxShadow = 'none';
}

export default function JoinForm({ onJoin, error, showSessionCode }: JoinFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim() &&
    role.trim() &&
    (!showSessionCode || sessionCode.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await onJoin(
      name.trim(),
      role.trim(),
      showSessionCode ? sessionCode.trim() : undefined
    );
    setSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: C.cream }}
    >
      {/* Decorative blobs */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '-8%', right: '-12%', width: '55%', opacity: 0.12 }}
        animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 100 100">
          <path d={bgBlob1} fill={C.sage} />
        </svg>
      </motion.div>
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: '-5%', left: '-10%', width: '40%', opacity: 0.1 }}
        animate={{ y: [0, 4, 0], rotate: [0, -1.5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <svg viewBox="0 0 100 100">
          <path d={bgBlob2} fill={C.sageLight} />
        </svg>
      </motion.div>

      {/* Content */}
      <motion.div
        className="w-full max-w-sm relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo / title */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-block px-3 py-1 rounded-full mb-3"
            style={{
              backgroundColor: C.sagePale,
              fontFamily: "'Consolas', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              color: C.accentOlive,
              textTransform: 'uppercase' as const,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Live session
          </motion.div>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: '1.7rem',
              fontWeight: 'bold',
              color: C.black,
              lineHeight: 1.2,
            }}
          >
            Techativity
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Calibri', sans-serif",
              fontSize: '0.85rem',
              color: C.midGray,
            }}
          >
            Join the conversation
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {showSessionCode && (
            <div className="mb-4">
              <label
                style={{
                  fontFamily: "'Calibri', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: C.darkText,
                  display: 'block',
                  marginBottom: '0.4rem',
                }}
              >
                Session code
              </label>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123"
                maxLength={8}
                autoFocus
                className="w-full px-4 py-3 rounded-xl outline-none transition-shadow tracking-widest text-center font-semibold"
                style={{
                  ...inputStyle,
                  fontFamily: "'Consolas', monospace",
                  fontSize: '1.2rem',
                  letterSpacing: '0.2em',
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          )}

          <div className="mb-4">
            <label
              style={{
                fontFamily: "'Calibri', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 600,
                color: C.darkText,
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              autoFocus={!showSessionCode}
              className="w-full px-4 py-3 rounded-xl outline-none transition-shadow"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="mb-4">
            <label
              style={{
                fontFamily: "'Calibri', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 600,
                color: C.darkText,
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              Your role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Developer, Designer, PM…"
              maxLength={40}
              className="w-full px-4 py-3 rounded-xl outline-none transition-shadow"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {error && (
            <motion.p
              className="mb-3 text-center"
              style={{
                fontFamily: "'Calibri', sans-serif",
                fontSize: '0.8rem',
                color: '#c44',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full py-3.5 rounded-xl font-semibold transition-all"
            style={{
              backgroundColor: canSubmit ? C.sage : C.sageLight,
              color: canSubmit ? C.white : C.warmGray,
              fontFamily: "'Calibri', sans-serif",
              fontSize: '1rem',
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'default',
              opacity: submitting ? 0.7 : 1,
            }}
            whileTap={canSubmit ? { scale: 0.97 } : undefined}
          >
            {submitting ? 'Joining…' : 'Join'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
