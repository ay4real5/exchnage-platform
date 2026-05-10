'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, Loader2, FileStack, ExternalLink, MessageSquare,
  LayoutList, Columns3, Search, RotateCcw, Volume2, VolumeX, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const CRYPTO_PRICES: Record<string, number> = { BTC: 64000, ETH: 3400, USDT: 1 };

function fmtDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function blockchainLink(hash: string, crypto: string) {
  if (crypto === 'BTC') return `https://mempool.space/tx/${hash}`;
  if (crypto === 'ETH') return `https://etherscan.io/tx/${hash}`;
  return '#';
}

function statusColor(s: string) {
  switch (s) {
    case 'PENDING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'CONFIRMED': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    case 'CREDITED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'REJECTED': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
  }
}

export function TransactionManager() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [soundOn, setSoundOn] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [fiatInputs, setFiatInputs] = useState<Record<string, string>>({});

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions?status=${filter}`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // live polling every 5s
  useEffect(() => {
    const id = setInterval(fetchTransactions, 5000);
    return () => clearInterval(id);
  }, [fetchTransactions]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '/') { e.preventDefault(); document.getElementById('tx-search')?.focus(); }
      if (e.key === 'v' || e.key === 'V') { e.preventDefault(); setView(v => v === 'list' ? 'kanban' : 'list'); }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); fetchTransactions(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fetchTransactions]);

  const updateTransaction = async (id: string, updates: any) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error ?? 'Failed');
        return;
      }
      toast.success('Updated!');
      fetchTransactions();
    } catch (e: any) {
      toast.error('Error');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = transactions.filter((tx: any) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (tx.user?.name?.toLowerCase() ?? '').includes(q) ||
      (tx.user?.email?.toLowerCase() ?? '').includes(q) ||
      (tx.transactionHash?.toLowerCase() ?? '').includes(q) ||
      (tx.bankName?.toLowerCase() ?? '').includes(q)
    );
  });

  const txsByStatus = {
    PENDING: filtered.filter((t: any) => t.status === 'PENDING'),
    CONFIRMED: filtered.filter((t: any) => t.status === 'CONFIRMED'),
    CREDITED: filtered.filter((t: any) => t.status === 'CREDITED'),
    REJECTED: filtered.filter((t: any) => t.status === 'REJECTED'),
  };

  const TxCard = ({ tx, compact }: { tx: any; compact?: boolean }) => {
    const usdVal = (tx.amountCrypto ?? 0) * (CRYPTO_PRICES[tx.cryptoType] ?? 0);
    const link = blockchainLink(tx.transactionHash, tx.cryptoType);
    const isDone = tx.status === 'CREDITED' || tx.status === 'REJECTED';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 hover:bg-white/[0.05] transition-colors"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-white">{tx.amountCrypto} {tx.cryptoType}</span>
              <span className="text-zinc-500 text-sm">→ {tx.fiatCurrency}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${statusColor(tx.status)}`}>
                {tx.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {tx.user?.name ?? 'Unknown'} • {tx.user?.email ?? ''} • {fmtDate(tx.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-white">${usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-[10px] text-zinc-500">USD value</p>
          </div>
        </div>

        {/* Hash + Bank */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Transaction Hash</p>
            <a href={link} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline truncate">
              {tx.transactionHash} <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Payout Account</p>
            <p className="text-xs text-zinc-300">{tx.bankName} • {tx.accountNumber} • {tx.accountName}</p>
            {tx.sortCode && <p className="text-[10px] text-zinc-500">Sort: {tx.sortCode}</p>}
          </div>
        </div>

        {/* Admin Actions */}
        {!isDone && !compact && (
          <div className="border-t border-white/5 pt-3 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Fiat Amount ({tx.fiatCurrency})</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 50000"
                  value={fiatInputs[tx.id] ?? (tx.amountFiat != null ? String(tx.amountFiat) : '')}
                  onChange={e => setFiatInputs(p => ({ ...p, [tx.id]: e.target.value }))}
                  className="w-full mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="flex-[2]">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Admin Note</label>
                <input
                  type="text"
                  placeholder="Optional note for this transaction..."
                  value={noteInputs[tx.id] ?? ''}
                  onChange={e => setNoteInputs(p => ({ ...p, [tx.id]: e.target.value }))}
                  className="w-full mt-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {tx.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => updateTransaction(tx.id, {
                      status: 'CONFIRMED',
                      amountFiat: fiatInputs[tx.id] ?? tx.amountFiat ?? undefined,
                      adminNote: noteInputs[tx.id] || undefined,
                    })}
                    disabled={actionLoading === tx.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {actionLoading === tx.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    Confirm
                  </button>
                  <button
                    onClick={() => updateTransaction(tx.id, {
                      status: 'REJECTED',
                      adminNote: noteInputs[tx.id] || 'Rejected by admin',
                    })}
                    disabled={actionLoading === tx.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-semibold hover:bg-rose-500/30 disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              )}
              {tx.status === 'CONFIRMED' && (
                <button
                  onClick={() => updateTransaction(tx.id, {
                    status: 'CREDITED',
                    amountFiat: fiatInputs[tx.id] ?? tx.amountFiat ?? undefined,
                    adminNote: noteInputs[tx.id] || 'Fiat credited to user',
                  })}
                  disabled={actionLoading === tx.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading === tx.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  Mark Credited
                </button>
              )}
            </div>
          </div>
        )}

        {/* Existing note */}
        {tx.adminNote && (
          <div className="mt-3 flex items-start gap-2 text-xs text-zinc-400 bg-white/5 rounded-lg p-2">
            <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-indigo-400" />
            <span><span className="text-zinc-300 font-medium">Note:</span> {tx.adminNote}</span>
          </div>
        )}

        {/* Fiat display */}
        {tx.amountFiat != null && (
          <div className="mt-2 text-sm font-medium text-emerald-400">
            {tx.fiatCurrency === 'NGN' ? '₦' : '£'}{Number(tx.amountFiat).toLocaleString()}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileStack className="h-5 w-5 text-indigo-400" /> Transactions
          </h2>
          <span className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{filtered.length}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              id="tx-search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 w-48"
            />
          </div>

          {/* View toggle */}
          <button
            onClick={() => setView(v => v === 'list' ? 'kanban' : 'list')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-zinc-400 hover:text-white hover:bg-white/10"
            title="Toggle view (v)"
          >
            {view === 'list' ? <Columns3 className="h-3.5 w-3.5" /> : <LayoutList className="h-3.5 w-3.5" />}
            {view === 'list' ? 'Kanban' : 'List'}
          </button>

          {/* Refresh */}
          <button
            onClick={fetchTransactions}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
            title="Refresh (r)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Sound */}
          <button
            onClick={() => setSoundOn(s => !s)}
            className={`p-1.5 rounded-lg border border-white/10 ${soundOn ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-zinc-400'} hover:text-white`}
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>

          {/* Filter */}
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CREDITED">Credited</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Shortcuts hint */}
      <div className="flex gap-3 text-[10px] text-zinc-600">
        <span><kbd className="px-1 rounded bg-white/5 border border-white/10">/</kbd> search</span>
        <span><kbd className="px-1 rounded bg-white/5 border border-white/10">v</kbd> toggle view</span>
        <span><kbd className="px-1 rounded bg-white/5 border border-white/10">r</kbd> refresh</span>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <FileStack className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No transactions found.</p>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((tx: any) => (
              <TxCard key={tx.id} tx={tx} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Kanban */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['PENDING', 'CONFIRMED', 'CREDITED'] as const).map(status => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${statusColor(status).split(' ')[0]}`}>
                  {status}
                </h3>
                <span className="text-xs text-zinc-500">{txsByStatus[status].length}</span>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {txsByStatus[status].map((tx: any) => (
                    <TxCard key={tx.id} tx={tx} compact />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
