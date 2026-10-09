'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start preloading canvas frames in background
    for (let i = 0; i < 240; i++) {
      const img = new window.Image();
      img.src = `/frames2/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
    }

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 18 + 5;
      });
    }, 120);

    // Hide after 2 seconds
    const timer = setTimeout(() => setVisible(false), 2000);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* Big faded logo in center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* Logo mark — very large and faded */}
            <div className="relative w-40 h-40 mb-8 opacity-90">
              <Image
                src="/logo.png"
                alt="IC"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Brand name */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', Calibri, sans-serif",
                fontSize: '10px',
                letterSpacing: '0.55em',
                color: '#5c1a25',
                textTransform: 'uppercase',
                fontWeight: 300,
                marginBottom: '6px',
              }}
            >
              Ijaz Casting &amp; Jewellery Centre
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', Calibri, sans-serif",
                fontSize: '8px',
                letterSpacing: '0.35em',
                color: '#c9a96e',
                textTransform: 'uppercase',
                fontWeight: 300,
              }}
            >
              Est. Sargodha
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-16 w-48"
          >
            <div className="w-full h-px bg-[#5c1a25]/15 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#c9a96e]"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
