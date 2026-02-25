// JoinForm.tsx — Participant name + role entry screen (olive bg, white text, pill buttons)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { C, F } from '../../lib/design-system';
import { SHAPES } from '../../lib/organic-shapes';
import { StaticOrganicShape } from '../common/MorphingShape';
import TechativityLogo from '../TechativityLogo';

interface JoinFormProps {
  onJoin: (name: string, role: string, sessionCode?: string) => void;
  error?: string | null;
  showSessionCode?: boolean;
}

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  border: '1.5px solid rgba(255,255,255,0.25)',
  fontFamily: "'Gambarino', 'Georgia', serif",
  fontSize: '1rem',
  color: C.white,
  borderRadius: '9999px',
};

function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(255,255,255,0.6)';
  e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.1)';
}

function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(255,255,255,0.25)';
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
      style={{ backgroundColor: C.olive }}
    >
      {/* Background organic shapes — subtle, low opacity */}
      <StaticOrganicShape shape={SHAPES.cloud} fill={C.white} opacity={0.04} floatAmp={6} floatDuration={12}
        style={{ right: '-10%', top: '-8%', width: '45%', height: '40%' }} />
      <StaticOrganicShape shape={SHAPES.sunBlob} fill={C.white} opacity={0.035} floatAmp={5} floatDuration={14} phase={0.3}
        style={{ left: '-8%', bottom: '-5%', width: '35%', height: '35%' }} />
      <StaticOrganicShape shape={SHAPES.bird} fill={C.white} opacity={0.03} floatAmp={4} floatDuration={11} phase={0.6}
        style={{ left: '-5%', top: '-10%', width: '28%', height: '30%' }} />
      <StaticOrganicShape shape={SHAPES.mountain} fill={C.white} opacity={0.03} floatAmp={3} floatDuration={13} phase={0.8}
        style={{ right: '-4%', bottom: '-8%', width: '25%', height: '25%' }} />

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
            color={C.white}
            width="260px"
            className="mb-3"
          />
          <motion.div
            className="inline-block px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontFamily: F.body,
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              color: C.white,
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
              color: C.white,
              opacity: 0.5,
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
                  color: C.white,
                  opacity: 0.6,
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
                className="w-full px-5 py-3 outline-none transition-shadow tracking-widest text-center font-semibold"
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
                color: C.white,
                opacity: 0.6,
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
              className="w-full px-5 py-3 outline-none transition-shadow"
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
                color: C.white,
                opacity: 0.6,
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
              placeholder="e.g. Developer, Designer, PM\u2026"
              maxLength={40}
              className="w-full px-5 py-3 outline-none transition-shadow"
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
                color: '#ff9999',
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
            className="w-full py-3.5 rounded-full transition-all"
            style={{
              backgroundColor: canSubmit ? 'transparent' : 'transparent',
              color: canSubmit ? C.white : 'rgba(255,255,255,0.3)',
              fontFamily: F.body,
              fontSize: '1.05rem',
              border: canSubmit
                ? '1.5px solid rgba(255,255,255,0.5)'
                : '1.5px solid rgba(255,255,255,0.15)',
              cursor: canSubmit ? 'pointer' : 'default',
              opacity: submitting ? 0.7 : 1,
            }}
            whileHover={canSubmit ? { scale: 1.03, borderColor: 'rgba(255,255,255,0.8)' } : undefined}
            whileTap={canSubmit ? { scale: 0.97 } : undefined}
          >
            {submitting ? 'Joining\u2026' : 'Join'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
