'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function FloatingFab({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 shadow-lg shadow-fuchsia-500/30 flex items-center justify-center text-white"
      aria-label="Quick send"
    >
      <Plus className="h-6 w-6" />
      <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" />
    </motion.button>
  );
}
