'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Loader2, FileStack, ExternalLink, MessageSquare,
  LayoutList, Columns3, Search, RotateCcw, Volume2, VolumeX,
  User, Bitcoin, Building2, ArrowRight, ShieldCheck, Ban, Banknote, AlertTriangle,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const CRYPTO_PRICES: Record<string, number> = { BTC: 64000, ETH: 3400, USDT: 1 };

function fmtDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function blockchainLink(hash: string, crypto: string) {
  if (crypto === 'BTC') return `https://mempool.space/tx/${hash}`;
  if (crypto === 'ETH') return `https://etherscan.io/tx/${hash}`;
  return '#';
}

function statusConfig(s: string) {
  switch (s) {
    case 'PENDING':
      return {
        label: 'AWAITING REVIEW',
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20',
        dot: 'bg-amber-400',
        icon: ShieldCheck,
        step: 1,
      };
    case 'CONFIRMED':
      return {
        label: 'CONFIRMED',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/20',
        dot: 'bg-cyan-400',
        icon: CheckCircle2,
        step: 2,
      };
    case 'CREDITED':
      return {
        label: 'COMPLETED',
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/10',
        border: 'border-emerald-400/20',
        dot: 'bg-emerald-400',
        icon: Banknote,
        step: 3,
      };
    case 'REJECTED':
      return {
        label: 'REJECTED',
        color: 'text-rose-400',
        bg: 'bg-rose-400/10',
        border: 'border-rose-400/20',
        dot: 'bg-rose-400',
        icon: Ban,
        step: 0,
      };
    default:
      return {
        label: s,
        color: 'text-zinc-400',
        bg: 'bg-zinc-400/10',
        border: 'border-zinc-400/20',
        dot: 'bg-zinc-400',
        icon: ShieldCheck,
        step: 0,
      };
  }
}

function Pipeline({ status }: { status: string }) {
  const steps = [
    { key: 'PENDING', label: 'Pending', desc: 'Awaiting admin review' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Crypto verified' },
    { key: 'CREDITED', label: 'Credited', desc: 'Fiat sent to user' },
  ];
  const currentStep = statusConfig(status).step;
  if (status === 'REJECTED') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2">
        <Ban className="h-4 w-4 text-rose-400" />
        <span className="text-sm font-semibold text-rose-400">Transaction Rejected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const isActive = i + 1 <= currentStep;
        const isCurrent = i + 1 === currentStep;
        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex flex-col items-center px-2 py-1 rounded-lg ${isCurrent ? 'bg-white/5' : ''}`}>
              <div className={`h-2.5 w-2.5 rounded-full ${isActive ? (isCurrent ? 'bg-amber-400 ring-2 ring-amber-400/30' : 'bg-emerald-400') : 'bg-zinc-700'}`} />
              <span className={`text-[9px] font-semibold mt-0.5 ${isActive ? 'text-white' : 'text-zinc-600'}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className={`h-3 w-3 mx-1 ${isActive && i + 1 < currentStep ? 'text-emerald-400' : 'text-zinc-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/transactions?status=${filter}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Failed to load transactions');
        setTransactions([]);
        return;
      }
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError('Network error — check console');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const id = setInterval(fetchTransactions, 5000);
    return () => clearInterval(id);
  }, [fetchTransactions]);

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
      toast.success('Transaction updated successfully');
      fetchTransactions();
    } catch (e: any) {
      toast.error('Error updating transaction');
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
      (tx.bankName?.toLowerCase() ?? '').includes(q) ||
      (tx.accountNumber ?? '').includes(q)
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
    const status = statusConfig(tx.status);
    const isDone = tx.status === 'CREDITED' || tx.status === 'REJECTED';
    const isExpanded = expanded[tx.id] ?? !compact;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border ${status.border} ${status.bg} backdrop-blur-xl overflow-hidden`}
      >
        {/* Card Header */}
        <div className="p-4">
          {/* Top row: Status + Pipeline */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <status.icon className={`h-4 w-4 ${status.color}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${status.color}`}>{status.label}</span>
            </div>
            <Pipeline status={tx.status} />
          </div>

          {/* Amount + User */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{tx.amountCrypto} {tx.cryptoType}</span>
                <span className="text-sm text-zinc-500">→ {tx.fiatCurrency}</span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">≈ ${usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-zinc-500">{fmtDate(tx.createdAt)}</p>
            </div>
          </div>

          {/* Collapsible toggle for compact */}
          {compact && (
            <button
              onClick={() => setExpanded(p => ({ ...p, [tx.id]: !isExpanded }))}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-2"
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {isExpanded ? 'Hide details' : 'Show details'}
            </button>
          )}

          {/* Details sections */}
          {isExpanded && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="rounded-xl bg-black/20 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
                  <User className="h-3 w-3" /> Customer
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[10px] text-zinc-600">Name</p>
                    <p className="text-zinc-200 font-medium">{tx.user?.name ?? 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600">Email</p>
                    <p className="text-zinc-200 font-medium">{tx.user?.email ?? 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Crypto Deposit */}
              <div className="rounded-xl bg-black/20 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
                  <Bitcoin className="h-3 w-3" /> Crypto Deposit
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[10px] text-zinc-600">Amount</p>
                    <p className="text-zinc-200 font-medium">{tx.amountCrypto} {tx.cryptoType}</p>
                    <p className="text-xs text-zinc-500">≈ ${usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600">Transaction Hash</p>
                    <a href={link} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline truncate">
                      {tx.transactionHash} <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bank Payout */}
              <div className="rounded-xl bg-black/20 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider">
                  <Building2 className="h-3 w-3" /> Payout Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[10px] text-zinc-600">Bank</p>
                    <p className="text-zinc-200 font-medium">{tx.bankName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600">Account Number</p>
                    <p className="text-zinc-200 font-medium font-mono">{tx.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600">Account Name</p>
                    <p className="text-zinc-200 font-medium">{tx.accountName}</p>
                  </div>
                  {tx.sortCode && (
                    <div>
                      <p className="text-[10px] text-zinc-600">Sort Code</p>
                      <p className="text-zinc-200 font-medium font-mono">{tx.sortCode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Review Section */}
              {!isDone && (
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 uppercase tracking-wider font-bold">
                    <ShieldCheck className="h-3 w-3" /> Admin Review
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Fiat Payout Amount ({tx.fiatCurrency})</label>
                      <input
                        type="number"
                        step="any"
                        placeholder={`Enter ${tx.fiatCurrency} amount...`}
                        value={fiatInputs[tx.id] ?? (tx.amountFiat != null ? String(tx.amountFiat) : '')}
                        onChange={e => setFiatInputs(p => ({ ...p, [tx.id]: e.target.value }))}
                        className="w-full mt-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Admin Note</label>
                      <input
                        type="text"
                        placeholder="Add a note (visible to team)..."
                        value={noteInputs[tx.id] ?? ''}
                        onChange={e => setNoteInputs(p => ({ ...p, [tx.id]: e.target.value }))}
                        className="w-full mt-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tx.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateTransaction(tx.id, {
                            status: 'CONFIRMED',
                            amountFiat: fiatInputs[tx.id] ?? tx.amountFiat ?? undefined,
                            adminNote: noteInputs[tx.id] || undefined,
                          })}
                          disabled={actionLoading === tx.id}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 shadow-lg shadow-emerald-500/20 transition-all"
                        >
                          {actionLoading === tx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          Confirm & Approve
                        </button>
                        <button
                          onClick={() => updateTransaction(tx.id, {
                            status: 'REJECTED',
                            adminNote: noteInputs[tx.id] || 'Transaction rejected by admin',
                          })}
                          disabled={actionLoading === tx.id}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 disabled:opacity-50 shadow-lg shadow-rose-500/20 transition-all"
                        >
                          <Ban className="h-4 w-4" /> Reject
                        </button>
                      </>
                    )}
                    {tx.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateTransaction(tx.id, {
                          status: 'CREDITED',
                          amountFiat: fiatInputs[tx.id] ?? tx.amountFiat ?? undefined,
                          adminNote: noteInputs[tx.id] || 'Fiat payment credited to user account',
                        })}
                        disabled={actionLoading === tx.id}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 shadow-lg shadow-indigo-500/20 transition-all"
                      >
                        {actionLoading === tx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                        Mark as Credited (Fiat Sent)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Existing note */}
              {tx.adminNote && (
                <div className="flex items-start gap-2 text-xs text-zinc-400 bg-white/5 rounded-xl p-3">
                  <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-indigo-400" />
                  <span><span className="text-zinc-300 font-medium">Admin Note:</span> {tx.adminNote}</span>
                </div>
              )}

              {/* Fiat amount display */}
              {tx.amountFiat != null && (
                <div className="text-sm font-bold text-emerald-400 bg-emerald-500/10 rounded-xl p-3 flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Approved Payout: {tx.fiatCurrency === 'NGN' ? '₦' : '£'}{Number(tx.amountFiat).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileStack className="h-5 w-5 text-indigo-400" /> Transaction Manager
          </h2>
          <span className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{filtered.length}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              id="tx-search"
              type="text"
              placeholder="Search user, hash, bank..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 w-56"
            />
          </div>

          <button
            onClick={() => setView(v => v === 'list' ? 'kanban' : 'list')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Toggle view (v)"
          >
            {view === 'list' ? <Columns3 className="h-3.5 w-3.5" /> : <LayoutList className="h-3.5 w-3.5" />}
            {view === 'list' ? 'Kanban' : 'List'}
          </button>

          <button
            onClick={fetchTransactions}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh (r)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setSoundOn(s => !s)}
            className={`p-1.5 rounded-lg border border-white/10 ${soundOn ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-zinc-400'} hover:text-white transition-colors`}
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending Review</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CREDITED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Shortcuts + Status counts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex gap-3 text-[10px] text-zinc-600">
          <span><kbd className="px-1 rounded bg-white/5 border border-white/10">/</kbd> search</span>
          <span><kbd className="px-1 rounded bg-white/5 border border-white/10">v</kbd> toggle view</span>
          <span><kbd className="px-1 rounded bg-white/5 border border-white/10">r</kbd> refresh</span>
        </div>
        <div className="flex gap-3 text-[10px]">
          <span className="text-amber-400">{txsByStatus.PENDING.length} pending</span>
          <span className="text-cyan-400">{txsByStatus.CONFIRMED.length} confirmed</span>
          <span className="text-emerald-400">{txsByStatus.CREDITED.length} completed</span>
          <span className="text-rose-400">{txsByStatus.REJECTED.length} rejected</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-rose-400">{error}</p>
            <button onClick={fetchTransactions} className="text-xs text-rose-300 underline mt-1">Retry</button>
          </div>
        </div>
      )}

      {loading && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
        </div>
      ) : filtered.length === 0 && !error ? (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['PENDING', 'CONFIRMED', 'CREDITED'] as const).map(status => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${statusConfig(status).color}`}>
                  {statusConfig(status).label}
                </h3>
                <span className="text-xs text-zinc-500 font-mono">{txsByStatus[status].length}</span>
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
