'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, Activity, Lightbulb, ArrowUpRight, Loader2 } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const tips = [
  'BTC typically clears in 10-60 minutes. USDT (TRC20) is fastest at ~2 minutes.',
  'Sending from a wallet you control? Use the exact transaction hash for fastest verification.',
  'Weekend submissions may take slightly longer due to banking hours.',
  'Always double-check your bank account name matches your ID exactly.',
];

export function ActivityFeed() {
  const [tipIndex, setTipIndex] = useState(0);
  const { data: prices } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });
  const { data: stats } = useSWR('/api/stats/me', fetcher);
  const { data: activity } = useSWR('/api/activity/recent', fetcher);

  useEffect(() => {
    const interval = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 8000);
    return () => clearInterval(interval);
  }, []);

  const btcPrice = prices?.bitcoin?.usd ?? 64000;

  return (
    <div className="space-y-4">
      {/* Best Rate */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Best Rate Now</p>
        </div>
        <p className="text-lg font-bold font-display">BTC → NGN</p>
        <p className="text-sm text-zinc-400 mt-1">1 BTC ≈ ₦{(btcPrice * 1581).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Your Stats</p>
        </div>
        {stats ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total sent</span>
              <span className="text-sm font-semibold">{stats?.totalSent ?? 0} transactions</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total received</span>
              <span className="text-sm font-semibold text-emerald-400">₦{(stats?.totalFiat ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Success rate</span>
              <span className="text-sm font-semibold text-emerald-400">{stats?.successRate ?? 0}%</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-500 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
        )}
      </motion.div>

      {/* Activity Ticker */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-fuchsia-500/20 flex items-center justify-center">
            <Activity className="h-4 w-4 text-fuchsia-400" />
          </div>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Live Activity</p>
        </div>
        {activity?.length > 0 ? (
          <div className="space-y-2.5">
            {activity.slice(0, 5).map((item: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-2 text-xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-zinc-400">{item.text}</span>
                <span className="text-zinc-600 ml-auto text-[10px]">{item.time}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-500 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
        )}
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">Did You Know?</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm text-zinc-300 leading-relaxed"
          >
            {tips[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
