'use client';

import { motion } from 'framer-motion';
import useSWR from 'swr';
import { TrendingUp, TrendingDown, Bitcoin, CircleDollarSign, Diamond } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { useCountUp } from './use-count-up';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const sparkData = [
  { v: 42000 }, { v: 44500 }, { v: 43800 }, { v: 46200 }, { v: 45100 },
  { v: 47800 }, { v: 46900 }, { v: 49500 }, { v: 51200 }, { v: 49800 },
  { v: 52300 }, { v: 54100 }, { v: 53200 }, { v: 55800 }, { v: 54600 },
  { v: 57200 }, { v: 58900 }, { v: 60100 }, { v: 59200 }, { v: 61800 },
  { v: 63500 }, { v: 62800 }, { v: 65200 }, { v: 64100 },
];

const coins = [
  { key: 'bitcoin', symbol: 'BTC', color: '#F7931A', icon: Bitcoin },
  { key: 'tether', symbol: 'USDT', color: '#26A17B', icon: CircleDollarSign },
  { key: 'ethereum', symbol: 'ETH', color: '#627EEA', icon: Diamond },
];

export function PortfolioOverview() {
  const { data: prices } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });
  const { data: stats } = useSWR('/api/stats/me', fetcher);
  const totalFiat = stats?.totalFiat ?? 0;
  const displayTotal = useCountUp(totalFiat, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 overflow-hidden"
    >
      {/* Rotating gradient border */}
      <div className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none">
        <div
          className="absolute inset-0 rounded-3xl opacity-30"
          style={{
            background: 'conic-gradient(from 0deg, #4f46e5, #d946ef, #06b6d4, #4f46e5)',
            animation: 'spin 8s linear infinite',
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 mb-1">Total Received</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display tabular-nums">
              ₦{displayTotal.toLocaleString()}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Lifetime fiat payouts</p>
          </div>
          <div className="hidden sm:block w-40 h-16 -mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d946ef" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Area type="monotone" dataKey="v" stroke="#d946ef" strokeWidth={2} fill="url(#portfolioGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5">
          {coins.map((coin) => {
            const p = prices?.[coin.key];
            const price = p?.usd ?? 0;
            const change = p?.usd_24h_change ?? 0;
            const Icon = coin.icon;
            return (
              <div key={coin.symbol} className="rounded-xl bg-white/5 border border-white/5 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="h-3.5 w-3.5" style={{ color: coin.color }} />
                  <span className="text-[10px] font-bold uppercase text-zinc-400">{coin.symbol}</span>
                </div>
                <p className="text-sm font-semibold tabular-nums">
                  ${price ? price.toLocaleString(undefined, { maximumFractionDigits: coin.symbol === 'USDT' ? 3 : 0 }) : '---'}
                </p>
                <p className={`text-[10px] flex items-center gap-0.5 mt-0.5 ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {change ? Math.abs(change).toFixed(2) + '%' : '---'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
