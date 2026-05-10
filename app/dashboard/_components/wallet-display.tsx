'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bitcoin, Copy, Check, Wallet, Loader2, AlertCircle, ArrowRight, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const cryptoMeta: Record<string, { color: string; bg: string; label: string; icon: typeof Bitcoin }> = {
  BTC: { color: '#F7931A', bg: 'bg-orange-500/10', label: 'Bitcoin', icon: Bitcoin },
  USDT: { color: '#26A17B', bg: 'bg-emerald-500/10', label: 'Tether', icon: Wallet },
  ETH: { color: '#627EEA', bg: 'bg-blue-500/10', label: 'Ethereum', icon: Wallet },
};

export function WalletDisplay() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await fetch('/api/wallets');
      const data = await res.json();
      setWallets(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch wallets error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async (id: string, address: string) => {
    try {
      await navigator?.clipboard?.writeText?.(address);
      setCopiedId(id);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if ((wallets?.length ?? 0) === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8 text-white text-center"
      >
        <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-8 w-8 text-zinc-500" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-2">No Wallet Addresses Available</h3>
        <p className="text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
          Wallet addresses will appear here once the admin adds them. Check back soon.
        </p>
        <Link href="/dashboard">
          <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
            Back to Overview
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {(wallets ?? []).map((wallet: any, i: number) => {
          const meta = cryptoMeta?.[wallet?.cryptoType] ?? { color: '#888', bg: 'bg-zinc-800', label: wallet?.cryptoType ?? 'Unknown', icon: Wallet };
          const Icon = meta.icon;
          return (
            <motion.div
              key={wallet?.id ?? i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-5 text-white relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${meta.bg}`}>
                  <Icon className="h-5 w-5" style={{ color: meta.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{meta.label}</p>
                  <p className="text-xs text-zinc-500">{wallet?.cryptoType}</p>
                </div>
              </div>

              {wallet?.label && (
                <p className="text-xs text-zinc-400 mb-3">{wallet.label}</p>
              )}

              <div className="flex items-center gap-2 mb-4">
                <code className="flex-1 rounded-lg bg-zinc-900/80 border border-zinc-800 p-3 text-xs font-mono break-all text-zinc-300">
                  {wallet?.address ?? ''}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  onClick={() => copyAddress(wallet?.id ?? '', wallet?.address ?? '')}
                >
                  {copiedId === wallet?.id ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Link href={`/dashboard/send?crypto=${wallet?.cryptoType}`}>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 hover:opacity-90 text-white text-sm h-10 rounded-xl"
                >
                  Send {wallet?.cryptoType} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
