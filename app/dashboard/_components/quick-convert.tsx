'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const cryptoOptions = ['BTC', 'USDT', 'ETH'];
const fiatOptions = ['NGN', 'GBP'];

const rateMap: Record<string, number> = { BTC: 1581, USDT: 0.00065, ETH: 84.5 };
const fiatRate: Record<string, number> = { NGN: 1, GBP: 0.00048 };

const fiatRates: Record<string, number> = { NGN: 1581, GBP: 0.00048 };
const priceKeys: Record<string, string> = { BTC: 'bitcoin', USDT: 'tether', ETH: 'ethereum' };

export function QuickConvert({ onSend }: { onSend?: (crypto: string, amount: string) => void }) {
  const [crypto, setCrypto] = useState('BTC');
  const [fiat, setFiat] = useState('NGN');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [focus, setFocus] = useState<'crypto' | 'usd'>('crypto');
  const [timer, setTimer] = useState(30);
  const { data: prices } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 30)), 1000);
    return () => clearInterval(interval);
  }, []);

  const livePrice = prices?.[priceKeys[crypto]]?.usd ?? (crypto === 'BTC' ? 64000 : crypto === 'ETH' ? 3400 : 1);

  // NGN rate: live USD price * 1581
  const ngnRate = livePrice * 1581;
  const converted = cryptoAmount ? parseFloat(cryptoAmount) * ngnRate * (fiat === 'GBP' ? 0.00048 : 1) : 0;
  const symbol = fiat === 'GBP' ? '£' : '₦';

  // Sync crypto from USD input
  const handleUsd = (val: string) => {
    setUsdAmount(val);
    setFocus('usd');
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      setCryptoAmount((n / livePrice).toFixed(8));
    } else {
      setCryptoAmount('');
    }
  };

  // Sync USD from crypto input
  const handleCrypto = (val: string) => {
    setCryptoAmount(val);
    setFocus('crypto');
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      setUsdAmount((n * livePrice).toFixed(2));
    } else {
      setUsdAmount('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Instant Convert</p>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <Clock className="h-3 w-3" />
            <div className="w-8 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div className="h-full bg-emerald-500" animate={{ width: `${(timer / 30) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Crypto + USD dual input */}
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/5 border border-white/5 p-4 focus-within:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">You send</span>
              <select
                value={crypto}
                onChange={(e) => {
                  const c = e.target.value;
                  setCrypto(c);
                  // recalculate other field based on focus
                  if (focus === 'usd' && usdAmount) {
                    const p = prices?.[priceKeys[c]]?.usd ?? (c === 'BTC' ? 64000 : c === 'ETH' ? 3400 : 1);
                    setCryptoAmount((parseFloat(usdAmount) / p).toFixed(8));
                  } else if (focus === 'crypto' && cryptoAmount) {
                    const p = prices?.[priceKeys[c]]?.usd ?? (c === 'BTC' ? 64000 : c === 'ETH' ? 3400 : 1);
                    setUsdAmount((parseFloat(cryptoAmount) * p).toFixed(2));
                  }
                }}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                {cryptoOptions.map((c) => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>

            {/* Two inputs side by side */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={cryptoAmount}
                  onChange={(e) => handleCrypto(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-white placeholder:text-zinc-700 focus:outline-none tabular-nums"
                />
                <span className="text-[10px] text-zinc-600">{crypto}</span>
              </div>
              <div className="space-y-1 border-l border-white/5 pl-3">
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={usdAmount}
                  onChange={(e) => handleUsd(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-zinc-300 placeholder:text-zinc-700 focus:outline-none tabular-nums"
                />
                <span className="text-[10px] text-zinc-600">USD</span>
              </div>
            </div>
          </div>

          {/* Equals */}
          <div className="flex justify-center -my-1 relative z-10">
            <div className="h-7 w-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] text-zinc-500 font-bold">
              =
            </div>
          </div>

          {/* Fiat output */}
          <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">You receive</span>
              <select
                value={fiat}
                onChange={(e) => setFiat(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                {fiatOptions.map((f) => <option key={f} value={f} className="bg-zinc-900">{f}</option>)}
              </select>
            </div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">
              {converted > 0 ? `${symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `${symbol}0`}
            </div>
            {converted > 0 && (
              <p className="text-[10px] text-zinc-500 mt-1">at live market rate</p>
            )}
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 hover:opacity-90 text-white font-semibold h-11 rounded-xl"
          onClick={() => onSend?.(crypto, cryptoAmount)}
          disabled={!cryptoAmount || parseFloat(cryptoAmount) <= 0}
        >
          <Send className="h-4 w-4 mr-2" /> Send This Amount
        </Button>
      </div>
    </motion.div>
  );
}
