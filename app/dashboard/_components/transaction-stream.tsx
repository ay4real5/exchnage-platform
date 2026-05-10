'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, CheckCircle2, XCircle, AlertCircle, Copy, Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock; glow: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock, glow: 'shadow-amber-500/20' },
  CONFIRMED: { label: 'Confirmed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: CheckCircle2, glow: 'shadow-blue-500/20' },
  CREDITED: { label: 'Credited', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2, glow: 'shadow-emerald-500/20' },
  REJECTED: { label: 'Rejected', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: XCircle, glow: 'shadow-rose-500/20' },
};

const filters = ['ALL', 'PENDING', 'CONFIRMED', 'CREDITED', 'REJECTED'];

function StatusOrb({ status }: { status: string }) {
  const isPending = status === 'PENDING';
  const isCredited = status === 'CREDITED';
  const color = isPending ? 'bg-amber-400' : isCredited ? 'bg-emerald-400' : 'bg-zinc-500';
  const pulse = isPending || isCredited;

  return (
    <span className="relative flex h-2.5 w-2.5 mr-2">
      {pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

export function TransactionStream({ limit }: { limit?: number }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => { fetchTransactions(); }, [filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const url = filter === 'ALL' ? '/api/transactions' : `/api/transactions?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setTransactions(limit ? arr.slice(0, limit) : arr);
    } catch {}
    setLoading(false);
  };

  const copyHash = async (hash: string) => {
    try { await navigator.clipboard.writeText(hash); setCopiedHash(hash); toast.success('Copied'); setTimeout(() => setCopiedHash(null), 2000); } catch {}
  };

  const getProgress = (status: string) => {
    switch (status) { case 'PENDING': return 33; case 'CONFIRMED': return 66; case 'CREDITED': return 100; default: return 0; }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Transaction Stream</p>
          <p className="text-xs text-zinc-400 mt-0.5">Track your conversions live</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                filter === f ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f === 'ALL' ? 'All' : f[0] + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-zinc-600" /></div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-10">
          <AlertCircle className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">No transactions yet</p>
          <p className="text-xs text-zinc-600 mt-1">Submit your first crypto payment</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {transactions.map((tx: any, i: number) => {
              const cfg = statusConfig[tx?.status ?? 'PENDING'] ?? statusConfig.PENDING;
              const progress = getProgress(tx?.status);
              const Icon = cfg.icon;
              const isRejected = tx?.status === 'REJECTED';

              return (
                <motion.div
                  key={tx?.id ?? i}
                  layout
                  initial={{ opacity: 0, y: 12, filter: 'brightness(1.5)' }}
                  animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className={`rounded-xl bg-white/[0.04] border border-white/5 p-4 ${cfg.glow}`}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${cfg.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{tx?.amountCrypto ?? 0} {tx?.cryptoType ?? ''} → {tx?.fiatCurrency ?? ''}</p>
                        <p className="text-[10px] text-zinc-500">{tx?.createdAt ? formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true }) : ''}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>{cfg.label}</span>
                  </div>

                  {!isRejected && (
                    <div className="mb-2.5">
                      <div className="flex items-center gap-1 text-[9px] text-zinc-600 mb-1 uppercase tracking-wider">
                        <span className={progress >= 33 ? 'text-amber-400' : ''}>Received</span>
                        <span className="flex-1" />
                        <span className={progress >= 66 ? 'text-blue-400' : ''}>Confirmed</span>
                        <span className="flex-1" />
                        <span className={progress >= 100 ? 'text-emerald-400' : ''}>Credited</span>
                      </div>
                      <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500"
                          initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.2, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <StatusOrb status={tx?.status} />
                      <span className="font-mono truncate max-w-[140px]" title={tx?.transactionHash ?? ''}>{tx?.transactionHash ?? ''}</span>
                      <button onClick={() => copyHash(tx?.transactionHash ?? '')} className="text-zinc-600 hover:text-white transition-colors">
                        {copiedHash === tx?.transactionHash ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <span>{tx?.bankName ?? ''}</span>
                  </div>

                  {tx?.adminNote && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">{tx.adminNote}</div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
