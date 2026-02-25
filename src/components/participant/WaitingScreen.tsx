// WaitingScreen.tsx — Waiting for presenter to activate a question
import { motion } from 'framer-motion';
import { C } from '../../lib/design-system';
import { blobPath, hashToSeed } from '../../lib/blob-generator';
import { useMemo } from 'react';

interface WaitingScreenProps {
  name: string;
  message?: string;
}

export default function WaitingScreen({
  name,
  message = 'Waiting for the next question…',
}: WaitingScreenProps) {
  // Generate a personal blob based on participant name
  const personalBlob = useMemo(() => {
    const seed = hashToSeed(name);
    return blobPath(50, 50, 38, { seed, points: 9, wobble: 0.28 });
  }, [name]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: C.cream }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Personal blob with gentle breathing */}
        <motion.div
          className="w-28 h-28 mb-6"
          animate={{
            scale: [1, 1.06, 1],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d={personalBlob} fill={C.sage} opacity={0.35} />
          </svg>
        </motion.div>

        {/* Greeting */}
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: C.darkText,
            textAlign: 'center',
          }}
        >
          Hi, {name}
        </h2>

        {/* Waiting message */}
        <motion.p
          className="mt-3"
          style={{
            fontFamily: "'Calibri', sans-serif",
            fontSize: '0.9rem',
            color: C.midGray,
            textAlign: 'center',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>

        {/* Dots animation */}
        <div className="flex gap-2 mt-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: C.sage }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.1, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
