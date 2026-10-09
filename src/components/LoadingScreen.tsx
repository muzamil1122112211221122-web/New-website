'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Aggressively preload the video so it's ready before loading screen hides
function preloadVideo(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.preload = 'auto';
    // Once enough data loaded to start playback, resolve
    video.addEventListener('canplaythrough', () => resolve(), { once: true });
    video.addEventListener('error', () => resolve(), { once: true }); // resolve on error too so UI never hangs
    video.load();
    // Fallback: resolve after 4s regardless
    setTimeout(resolve, 4000);
  });
}

// Preload critical images (logo, first product images etc.)
function preloadImages(srcs: string[]) {
  srcs.forEach(src => {
    const img = new window.Image();
    img.src = src;
  });
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Preload critical images
    preloadImages([
      '/logo.png',
    ]);

    // 2. Preload the hero video
    preloadVideo('/upscaled-video.mp4').then(() => {
      setProgress(100);
      setTimeout(() => setVisible(false), 300);
    });

    // 3. Animate progress bar while video loads
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return p; } // Stop at 90, video load completes it
        return p + Math.random() * 12 + 4;
      });
    }, 100);

    // 4. Hard max — hide after 5s no matter what (slow connections)
    const timer = setTimeout(() => setVisible(false), 5000);

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
            {/* Logo mark */}
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
                fontFamily: "'Poppins', 'Gill Sans MT', sans-serif"Gill Sans MT', Calibri, sans-serif",
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
                fontFamily: "'Poppins', 'Gill Sans MT', sans-serif"Gill Sans MT', Calibri, sans-serif",
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
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
