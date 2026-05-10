'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TopTicker() {
  const { data: prices } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const btc = prices?.bitcoin;
  const usdt = prices?.tether;
  const eth = prices?.ethereum;

  const items = [
    { symbol: 'BTC', price: btc?.usd, change: btc?.usd_24h_change, color: '#F7931A' },
    { symbol: 'USDT', price: usdt?.usd, change: usdt?.usd_24h_change, color: '#26A17B' },
    { symbol: 'ETH', price: eth?.usd, change: eth?.usd_24h_change, color: '#627EEA' },
  ];

  if (!mounted) return null;

  return (
    <div className="w-full overflow-hidden border-b border-white/5 bg-white/5 backdrop-blur-sm">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 py-1.5 text-xs">
            <span className="font-bold" style={{ color: item.color }}>{item.symbol}</span>
            <span className="text-white/80 font-mono tabular-nums">
              ${item.price ? Number(item.price).toLocaleString(undefined, { maximumFractionDigits: item.symbol === 'USDT' ? 3 : 0 }) : '---'}
            </span>
            {item.change != null && (
              <span className={`flex items-center gap-0.5 ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(item.change).toFixed(2)}%
              </span>
            )}
            <span className="text-white/20 mx-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
