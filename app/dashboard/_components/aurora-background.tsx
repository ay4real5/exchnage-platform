'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AuroraBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]">
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Blob 1 - indigo */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-40"
        style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }}
        animate={{
          x: [0, 60, 20, 0],
          y: [0, 30, 60, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blob 2 - fuchsia */}
      <motion.div
        className="absolute top-[20%] -right-[15%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-30"
        style={{ background: 'radial-gradient(circle, #d946ef 0%, transparent 70%)' }}
        animate={{
          x: [0, -40, -20, 0],
          y: [0, 50, 20, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      {/* Blob 3 - cyan */}
      <motion.div
        className="absolute -bottom-[10%] left-[20%] w-[55vw] h-[55vw] rounded-full blur-[110px] opacity-25"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        animate={{
          x: [0, 50, -20, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.05, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      {/* Subtle radial overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/40 to-[#0a0a0f]/80" />
    </div>
  );
}
