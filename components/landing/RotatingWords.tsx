'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const WORDS = [
  'banking sector',
  'NPL ratios',
  'balance sheets',
  'macro trends',
  'P&L metrics',
  'credit risk',
] as const;

export default function RotatingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="landing-rotating-words inline-block relative align-bottom overflow-hidden"
      style={{ minWidth: '15ch', height: '1.12em', verticalAlign: 'bottom' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -28, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }}
          className="absolute left-0 right-0 whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #F97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
