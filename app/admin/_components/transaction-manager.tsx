'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Loader2, FileStack, ExternalLink, MessageSquare,
  LayoutList, Columns3, Search, RotateCcw, Volume2, VolumeX,
  User, Bitcoin, Building2, ShieldCheck, Ban, Banknote, AlertTriangle,
  ChevronDown, ChevronUp, Clock, MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

const CRYPTO_PRICES: Record<string, number> = { BTC: 64000, ETH: 3400, USDT: 1 };

function fmtDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtShortDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function blockchainLink(hash: string, crypto: string) {
  if (crypto === 'BTC') return `https://mempool.space/tx/${hash}`;
  if (crypto === 'ETH') return `https://etherscan.io/tx/${hash}`;
  return '#';
}

function statusBadge(s: string) {
  switch (s) {
    case 'PENDING': return { label: 'Pending', class: 'bg-amber-500/15 text-amber-400 border-amber-500/20' };
    case 'CONFIRMED': return { label: 'Confirmed', class: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' };
    case 'CREDITED': return { label: 'Completed', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' };
    case 'REJECTED': return { label: 'Rejected', class: 'bg-rose-500/15 text-rose-400 border-rose-500/20' };
    default: return { label: s, class: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' };
  }
}

export function TransactionManager() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [soundOn, setSoundOn] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [fiatInputs, setFiatInputs] = useState<Record<string, string>>({});
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    setError(null);
    setErrorDetails(null);
    try {
      const res = await fetch(`/api/transactions?status=${statusFilter}`);
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.details || data?.error || 'Failed to load transactions';
        setError(msg);
        setErrorDetails(JSON.stringify(data, null, 2));
        setTransactions([]);
        return;
      }
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError('Network error — check console');
      setErrorDetails(e?.message || String(e));
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  useEffect(() => {
    const id = setInterval(() => fetchTransactions({ silent: true }), 30000);
    return () => clearInterval(id);
  }, [fetchTransactions]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '/') { e.preventDefault(); document.getElementById('tx-search')?.focus(); }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); fetchTransactions(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fetchTransactions]);

  const updateTransaction = async (id: string, updates: any) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) { toast.error((await res.json())?.error ?? 'Failed'); return; }
      toast.success('Transaction updated');
      fetchTransactions();
    } catch { toast.error('Error updating transaction'); }
    finally { setActionLoading(null); }
  };

  const filtered = transactions.filter((tx: any) => {
    const q = search.toLowerCase();
    return !q ||
      (tx.user?.name?.toLowerCase() ?? '').includes(q) ||
      (tx.user?.email?.toLowerCase() ?? '').includes(q) ||
      (tx.transactionHash?.toLowerCase() ?? '').includes(q) ||
      (tx.bankName?.toLowerCase() ?? '').includes(q) ||
      (tx.accountNumber ?? '').includes(q);
  });

  const counts = {
    ALL: filtered.length,
    PENDING: transactions.filter((t: any) => t.status === 'PENDING').length,
    CONFIRMED: transactions.filter((t: any) => t.status === 'CONFIRMED').length,
    CREDITED: transactions.filter((t: any) => t.status === 'CREDITED').length,
    REJECTED: transactions.filter((t: any) => t.status === 'REJECTED').length,
  };

  const tabs = [
    { key: 'ALL', label: 'All', count: counts.ALL },
    { key: 'PENDING', label: 'Pending', count: counts.PENDING, alert: counts.PENDING > 0 },
    { key: 'CONFIRMED', label: 'Confirmed', count: counts.CONFIRMED },
    { key: 'CREDITED', label: 'Completed', count: counts.CREDITED },
    { key: 'REJECTED', label: 'Rejected', count: counts.REJECTED },
  ];

  const displayed = statusFilter === 'ALL' ? filtered : filtered.filter((t: any) => t.status === statusFilter);

  const TxRow = ({ tx }: { tx: any }) => {
    const usdVal = (tx.amountCrypto ?? 0) * (CRYPTO_PRICES[tx.cryptoType] ?? 0);
    const link = blockchainLink(tx.transactionHash, tx.cryptoType);
    const badge = statusBadge(tx.status);
    const isExpanded = expandedTx === tx.id;
    const isDone = tx.status === 'CREDITED' || tx.status === 'REJECTED';

    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden"
      >
        {/* Row Header */}
        <div
          className="flex items-center gap-3 p-4 cursor-pointer"
          onClick={() => setExpandedTx(isExpanded ? null : tx.id)}
        >
          {/* Status Dot */}
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            tx.status === 'PENDING' ? 'bg-amber-400 animate-pulse' :
            tx.status === 'CONFIRMED' ? 'bg-cyan-400' :
            tx.status === 'CREDITED' ? 'bg-emerald-400' : 'bg-rose-400'
          }`} />

          {/* Transaction ID */}
          <div className="flex-shrink-0 w-20">
            <span className="text-xs font-mono text-zinc-500">#{tx.id.slice(-6)}</span>
          </div>

          {/* Customer */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{tx.user?.name ?? 'Unknown'}</p>
            <p className="text-xs text-zinc-500 truncate">{tx.user?.email ?? 'N/A'}</p>
          </div>

          {/* Amount */}
          <div className="flex-shrink-0 w-32 text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{tx.amountCrypto} {tx.cryptoType}</p>
            <p className="text-xs text-zinc-500">≈ ${usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0 w-28 hidden md:block">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.class}`}>
              {badge.label}
            </span>
          </div>

          {/* Date */}
          <div className="flex-shrink-0 w-24 text-right hidden lg:block">
            <p className="text-xs text-zinc-400">{fmtShortDate(tx.createdAt)}</p>
            <p className="text-[10px] text-zinc-600">{new Date(tx.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          {/* Expand Icon */}
          <div className="flex-shrink-0">
            {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {/* Customer Details */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Customer
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Name</span>
                        <span className="text-white font-medium">{tx.user?.name ?? 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Email</span>
                        <span className="text-zinc-300">{tx.user?.email ?? 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Transaction ID</span>
                        <span className="text-zinc-300 font-mono text-xs">{tx.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Crypto Details */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                      <Bitcoin className="h-3 w-3" /> Crypto Deposit
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Amount</span>
                        <span className="text-white font-medium">{tx.amountCrypto} {tx.cryptoType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">USD Value</span>
                        <span className="text-zinc-300">≈ ${usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-zinc-500">Hash</span>
                        <a href={link} target="_blank" rel="noopener noreferrer"
                           className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 max-w-[200px] truncate">
                          {tx.transactionHash} <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Payout Details */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" /> Payout
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Currency</span>
                        <span className="text-white font-medium">{tx.fiatCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Bank</span>
                        <span className="text-zinc-300">{tx.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Account</span>
                        <span className="text-zinc-300 font-mono">{tx.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Name</span>
                        <span className="text-zinc-300">{tx.accountName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Note */}
                {tx.adminNote && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-white/5 p-3 text-xs">
                    <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-indigo-400" />
                    <span className="text-zinc-300"><span className="text-white font-medium">Note:</span> {tx.adminNote}</span>
                  </div>
                )}

                {/* Admin Actions */}
                {!isDone && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Fiat Amount ({tx.fiatCurrency})</label>
                        <input
                          type="number" step="any"
                          placeholder={`Enter ${tx.fiatCurrency} amount`}
                          value={fiatInputs[tx.id] ?? (tx.amountFiat != null ? String(tx.amountFiat) : '')}
                          onChange={e => setFiatInputs(p => ({ ...p, [tx.id]: e.target.value }))}
                          className="w-full mt-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Admin Note</label>
                        <input
                          type="text" placeholder="Add a note..."
                          value={noteInputs[tx.id] ?? ''}
                          onChange={e => setNoteInputs(p => ({ ...p, [tx.id]: e.target.value }))}
                          className="w-full mt-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tx.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateTransaction(tx.id, {
                              status: 'CONFIRMED',
                              amountFiat: fiatInputs[tx.id] ?? tx.amountFiat ?? undefined,
                              adminNote: noteInputs[tx.id] || undefined,
                            })}
                            disabled={actionLoading === tx.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                          >
                            {actionLoading === tx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Confirm & Approve
                          </button>
                          <button
                            onClick={() => updateTransaction(tx.id, {
                              status: 'REJECTED',
                              adminNote: noteInputs[tx.id] || 'Rejected by admin',
                            })}
                            disabled={actionLoading === tx.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-500 disabled:opacity-50 transition-colors"
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
                            adminNote: noteInputs[tx.id] || 'Fiat credited to user',
                          })}
                          disabled={actionLoading === tx.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === tx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                          Mark as Credited
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {tx.amountFiat != null && (
                  <div className="mt-4 text-sm font-semibold text-emerald-400 bg-emerald-500/10 rounded-lg p-3 flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Approved: {tx.fiatCurrency === 'NGN' ? '₦' : '£'}{Number(tx.amountFiat).toLocaleString()}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Transaction Manager</h2>
          <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-full font-mono">{filtered.length} total</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              id="tx-search"
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 w-64"
            />
          </div>
          <button
            onClick={() => fetchTransactions()}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Segmented Status Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/5 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                tab.alert && tab.key === 'PENDING'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-white/10 text-zinc-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-rose-400 flex-1">{error}</p>
            <button onClick={() => fetchTransactions()} className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30">Retry</button>
          </div>
          {errorDetails && (
            <pre className="mt-2 text-[10px] text-rose-300/70 bg-black/20 p-2 rounded-lg overflow-auto max-h-32 font-mono">{errorDetails}</pre>
          )}
        </div>
      )}

      {/* Transaction List */}
      {loading && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      ) : displayed.length === 0 && !error ? (
        <div className="text-center py-20 text-zinc-500">
          <FileStack className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No transactions found</p>
          <p className="text-xs text-zinc-600 mt-1">Transactions will appear here when users initiate them</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
            <div className="w-2 flex-shrink-0" />
            <div className="w-20 flex-shrink-0">ID</div>
            <div className="flex-1">Customer</div>
            <div className="w-32 text-right flex-shrink-0">Amount</div>
            <div className="w-28 flex-shrink-0">Status</div>
            <div className="w-24 text-right flex-shrink-0">Date</div>
            <div className="w-6 flex-shrink-0" />
          </div>
          <AnimatePresence mode="popLayout">
            {displayed.map((tx: any) => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
