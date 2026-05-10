'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCcw, Send, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import useSWR from 'swr';

const cryptoOptions = [
  { value: 'BTC', label: 'Bitcoin (BTC)', color: '#F7931A' },
  { value: 'USDT', label: 'Tether (USDT)', color: '#26A17B' },
  { value: 'ETH', label: 'Ethereum (ETH)', color: '#627EEA' },
];

const fiatOptions = [
  { value: 'NGN', label: 'Nigerian Naira (NGN)', symbol: '₦' },
  { value: 'GBP', label: 'British Pounds (GBP)', symbol: '£' },
];

// Approximate rates (will be overridden by live prices)
const baseRates: Record<string, { NGN: number; GBP: number }> = {
  BTC: { NGN: 104000000, GBP: 51000 },
  USDT: { NGN: 1550, GBP: 0.79 },
  ETH: { NGN: 5500000, GBP: 2700 },
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ConversionCalculator() {
  const [amount, setAmount] = useState('');
  const [crypto, setCrypto] = useState('BTC');
  const [fiat, setFiat] = useState('NGN');
  const { data: prices, isLoading: pricesLoading } = useSWR('/api/prices', fetcher, {
    refreshInterval: 60000,
  });

  // Compute live rate using CoinGecko USD price + our spread
  const rate = useMemo(() => {
    const usdPrice = prices?.[crypto.toLowerCase()]?.usd ?? 0;
    if (!usdPrice) return baseRates[crypto]?.[fiat as keyof typeof baseRates['BTC']] ?? 0;

    if (fiat === 'NGN') {
      // Use approximate NGN/USD rate of ~1550 + 2% spread
      return usdPrice * 1581;
    }
    if (fiat === 'GBP') {
      // Use approximate GBP/USD rate of ~0.79
      return usdPrice * 0.79;
    }
    return usdPrice;
  }, [prices, crypto, fiat]);

  const result = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return '0.00';
    return (val * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [amount, rate]);

  const symbol = fiatOptions.find((f) => f.value === fiat)?.symbol ?? '₦';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
            <RefreshCcw className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Instant Converter</h3>
            <p className="text-xs text-zinc-400">See exactly what you will receive before sending</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Crypto Input */}
          <div className="rounded-xl bg-zinc-900/70 border border-zinc-700/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">You send</span>
              {pricesLoading && <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />}
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent border-0 text-2xl font-bold font-display placeholder:text-zinc-600 focus-visible:ring-0 p-0 h-auto"
              />
              <select
                value={crypto}
                onChange={(e) => setCrypto(e.target.value)}
                className="bg-zinc-800 text-white text-sm font-medium rounded-lg px-3 py-2 border border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {cryptoOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-zinc-400" />
            </div>
          </div>

          {/* Fiat Output */}
          <div className="rounded-xl bg-zinc-900/70 border border-zinc-700/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">You receive</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-2xl font-bold font-display text-emerald-400">
                {symbol}{result}
              </div>
              <select
                value={fiat}
                onChange={(e) => setFiat(e.target.value)}
                className="bg-zinc-800 text-white text-sm font-medium rounded-lg px-3 py-2 border border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {fiatOptions.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rate info */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Rate: 1 {crypto} ≈ {symbol}{rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <span>Updated live</span>
          </div>

          {/* CTA */}
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 hover:opacity-90 text-white font-semibold h-12"
            onClick={() => {
              if (!amount || parseFloat(amount) <= 0) {
                toast.error('Enter an amount first');
                return;
              }
              // Pre-fill and navigate to send page
              const params = new URLSearchParams({ crypto, amount });
              window.location.href = `/dashboard/send?${params.toString()}`;
            }}
          >
            <Send className="h-4 w-4 mr-2" /> Send {crypto}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
