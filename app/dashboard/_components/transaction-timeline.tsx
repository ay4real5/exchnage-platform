'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, AlertCircle, Copy, ChevronRight, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pending', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: CheckCircle2 },
  CREDITED: { label: 'Credited', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: XCircle },
};

const filters = ['ALL', 'PENDING', 'CONFIRMED', 'CREDITED', 'REJECTED'];

export function TransactionTimeline({ limit, showViewAll }: { limit?: number; showViewAll?: boolean }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const url = filter === 'ALL' ? '/api/transactions' : `/api/transactions?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setTransactions(limit ? arr.slice(0, limit) : arr);
    } catch (error: any) {
      console.error('Fetch transactions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyHash = async (hash: string) => {
    try {
      await navigator?.clipboard?.writeText?.(hash);
      setCopiedHash(hash);
      toast.success('Hash copied!');
      setTimeout(() => setCopiedHash(null), 2000);
    } catch {}
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'PENDING': return 33;
      case 'CONFIRMED': return 66;
      case 'CREDITED': return 100;
      case 'REJECTED': return 0;
      default: return 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-lg">Transactions</h3>
          <p className="text-xs text-zinc-400">Track your crypto-to-fiat conversions</p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900/60 rounded-lg p-0.5 border border-zinc-700/50">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-10">
          <AlertCircle className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">No transactions yet</p>
          <p className="text-xs text-zinc-600 mt-1">Submit your first crypto payment to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {transactions.map((tx: any, i: number) => {
              const cfg = statusConfig[tx?.status ?? 'PENDING'] ?? statusConfig.PENDING;
              const progress = getProgress(tx?.status);
              const isRejected = tx?.status === 'REJECTED';

              return (
                <motion.div
                  key={tx?.id ?? i}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="rounded-xl bg-zinc-900/50 border border-zinc-800/60 p-4"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${cfg.color}`}>
                        <cfg.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {tx?.amountCrypto ?? 0} {tx?.cryptoType ?? ''} → {tx?.fiatCurrency ?? ''}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {tx?.createdAt ? formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true }) : ''}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {!isRejected && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-1">
                        <span className={progress >= 33 ? 'text-amber-400' : ''}>Received</span>
                        <span className="flex-1" />
                        <span className={progress >= 66 ? 'text-blue-400' : ''}>Confirmed</span>
                        <span className="flex-1" />
                        <span className={progress >= 100 ? 'text-emerald-400' : ''}>Credited</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="font-mono truncate max-w-[160px]" title={tx?.transactionHash ?? ''}>
                        {tx?.transactionHash ?? ''}
                      </span>
                      <button
                        onClick={() => copyHash(tx?.transactionHash ?? '')}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        {copiedHash === tx?.transactionHash ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <span>{tx?.bankName ?? ''} • {tx?.accountNumber ?? ''}</span>
                  </div>

                  {tx?.adminNote && (
                    <div className="mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                      {tx.adminNote}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {showViewAll && transactions.length > 0 && (
            <Link href="/dashboard/history">
              <Button variant="ghost" className="w-full text-zinc-400 hover:text-white mt-2">
                View all transactions <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
