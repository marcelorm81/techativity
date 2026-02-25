// JoinForm.tsx — Participant name + role entry screen (+ optional session code)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { SHAPES } from '../../lib/organic-shapes';
import TechativityLogo from '../TechativityLogo';

interface JoinFormProps {
  onJoin: (name: string, role: string, sessionCode?: string) => void;
  error?: string | null;
  showSessionCode?: boolean;
}

const inputStyle = {
  backgroundColor: C.white,
  border: `1.5px solid ${C.creamDark}`,
  fontFamily: F.body,
  fontSize: '1rem',
  color: C.olive,
};

function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = C.olive;
  e.target.style.boxShadow = `0 0 0 3px ${C.creamDark}`;
}

function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = C.creamDark;
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
      {/* Decorative organic shapes */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '-8%', right: '-12%', width: '55%', opacity: 0.08 }}
        animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox={SHAPES.bird.viewBox} preserveAspectRatio="xMidYMid meet">
          <path d={SHAPES.bird.d} fill={C.olive} />
        </svg>
      </motion.div>
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: '-5%', left: '-10%', width: '40%', opacity: 0.06 }}
        animate={{ y: [0, 4, 0], rotate: [0, -1.5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <svg viewBox={SHAPES.sun.viewBox} preserveAspectRatio="xMidYMid meet">
          <path d={SHAPES.sun.d} fill={C.oliveLight} />
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
        <div className="flex flex-col items-center mb-8">
          <TechativityLogo
            color={C.olive}
            width="260px"
            className="mb-3"
          />
          <motion.div
            className="inline-block px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: C.creamDark,
              fontFamily: F.body,
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              color: C.olive,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Live session
          </motion.div>
          <p
            className="mt-3"
            style={{
              fontFamily: F.body,
              fontSize: '0.9rem',
              color: C.olive,
              opacity: 0.6,
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
                  fontFamily: F.body,
                  fontSize: '0.8rem',
                  color: C.olive,
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
                fontFamily: F.body,
                fontSize: '0.8rem',
                color: C.olive,
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
                fontFamily: F.body,
                fontSize: '0.8rem',
                color: C.olive,
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
                fontFamily: F.body,
                fontSize: '0.85rem',
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
            className="w-full py-3.5 rounded-xl transition-all"
            style={{
              backgroundColor: canSubmit ? C.olive : C.creamDark,
              color: canSubmit ? C.white : C.lightGray,
              fontFamily: F.body,
              fontSize: '1.05rem',
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
