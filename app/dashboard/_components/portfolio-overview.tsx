'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import useSWR from 'swr';

const coinMeta: Record<string, { label: string; color: string; icon: typeof Bitcoin }> = {
  BTC: { label: 'Bitcoin', color: '#F7931A', icon: Bitcoin },
  USDT: { label: 'Tether', color: '#26A17B', icon: Wallet },
  ETH: { label: 'Ethereum', color: '#627EEA', icon: Wallet },
};

const sparklineData: Record<string, { value: number }[]> = {
  BTC: Array.from({ length: 7 }, (_, i) => ({ value: 64000 + Math.random() * 5000 - 2500 })),
  USDT: Array.from({ length: 7 }, (_, i) => ({ value: 1 + Math.random() * 0.02 - 0.01 })),
  ETH: Array.from({ length: 7 }, (_, i) => ({ value: 3400 + Math.random() * 300 - 150 })),
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function PortfolioOverview() {
  const { data: prices } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });
  const [totalFiat, setTotalFiat] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions?status=CREDITED')
      .then((r) => r.json())
      .then((txs) => {
        const total = (txs ?? []).reduce((sum: number, tx: any) => sum + (tx.amountFiat ?? 0), 0);
        setTotalFiat(total);
      })
      .finally(() => setLoading(false));
  }, []);

  const coins = ['BTC', 'USDT', 'ETH'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-zinc-400 mb-1">Total Payout Received</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold font-display">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                ) : (
                  `₦${totalFiat.toLocaleString()}`
                )}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                Lifetime
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-zinc-300">Live Prices</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {coins.map((coin, i) => {
            const meta = coinMeta[coin];
            const price = prices?.[coin?.toLowerCase()]?.usd ?? 0;
            const change = (Math.random() * 4 - 2).toFixed(2);
            const data = sparklineData[coin];
            const isUp = parseFloat(change) >= 0;

            return (
              <motion.div
                key={coin}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="rounded-xl bg-zinc-900/60 border border-zinc-800/60 p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${meta.color}20` }}
                  >
                    <meta.icon className="h-5 w-5" style={{ color: meta.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{meta.label}</p>
                    <p className="text-xs text-zinc-500">{coin}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold font-display">
                      {price ? `$${price.toLocaleString()}` : '—'}
                    </p>
                    <div className={`flex items-center gap-1 text-xs mt-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(parseFloat(change))}% 24h
                    </div>
                  </div>
                  <div className="w-20 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id={`grad-${coin}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={meta.color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={meta.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Area type="monotone" dataKey="value" stroke={meta.color} fill={`url(#grad-${coin})`} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
