'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bitcoin, Copy, Check, Wallet, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const cryptoMeta: Record<string, { color: string; bg: string; label: string; icon: typeof Bitcoin }> = {
  BTC: { color: '#F7931A', bg: 'bg-orange-500/10', label: 'Bitcoin', icon: Bitcoin },
  USDT: { color: '#26A17B', bg: 'bg-emerald-500/10', label: 'Tether', icon: Wallet },
  ETH: { color: '#627EEA', bg: 'bg-blue-500/10', label: 'Ethereum', icon: Wallet },
};

const demoWallets = [
  { id: 'demo-btc', cryptoType: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { id: 'demo-usdt', cryptoType: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  { id: 'demo-eth', cryptoType: 'ETH', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
];

export function WalletDrawer({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend?: (crypto: string) => void }) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (open) fetchWallets();
  }, [open]);

  const fetchWallets = async () => {
    setLoading(true);
    try { const res = await fetch('/api/wallets'); const data = await res.json(); setWallets(Array.isArray(data) ? data : []); } catch {}
    setLoading(false);
  };

  const copy = async (id: string, addr: string) => {
    try { await navigator.clipboard.writeText(addr); setCopiedId(id); toast.success('Copied'); setTimeout(() => setCopiedId(null), 2000); } catch {}
  };

  const displayWallets = wallets.length > 0 ? wallets : demoWallets;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-[#0c0c14] border-l border-white/10 z-50 overflow-y-auto scrollbar-none"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg">Deposit Addresses</h3>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"><X className="h-4 w-4" /></button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-zinc-600" /></div>
              ) : (
                <>
                  {wallets.length === 0 && (
                    <div className="mb-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-2">
                      <p className="text-[11px] text-indigo-300">Demo mode — these are placeholder addresses. Admin will replace with real ones.</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    {displayWallets.map((w: any, i: number) => {
                      const meta = cryptoMeta[w?.cryptoType] ?? { color: '#888', bg: 'bg-zinc-800', label: w?.cryptoType ?? 'Unknown', icon: Wallet };
                      const Icon = meta.icon;
                      return (
                        <motion.div key={w?.id ?? i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                          className="rounded-2xl border border-white/5 bg-white/[0.04] p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${meta.bg}`}>
                              <Icon className="h-4 w-4" style={{ color: meta.color }} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{meta.label}</p>
                              <p className="text-[10px] text-zinc-500">{w?.cryptoType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <code className="flex-1 rounded-lg bg-black/30 border border-white/5 p-2.5 text-[11px] font-mono break-all text-zinc-300">{w?.address ?? ''}</code>
                            <Button variant="outline" size="icon" className="border-zinc-700 hover:bg-zinc-800 text-zinc-400" onClick={() => copy(w?.id, w?.address)}>
                              {copiedId === w?.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white text-xs h-9 rounded-xl" onClick={() => { onSend?.(w?.cryptoType); onClose(); }}>
                            Send {w?.cryptoType} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
