'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <motion.div
        key={pathname + "-overlay"}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, ease: 'linear' }}
        className="fixed inset-0 bg-[#EFE9E1] z-[999] pointer-events-none"
      />
      <div key={pathname} className="flex-1 flex flex-col">
        {children}
      </div>
    </>
  );
}
