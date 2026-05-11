'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Loader2, FileStack, ExternalLink, MessageSquare,
  Search, RotateCcw, User, Bitcoin, Building2, ShieldCheck, Ban,
  Banknote, AlertTriangle, ChevronDown, ChevronUp, Clock, Copy,
  ArrowUpDown, TrendingUp, AlertCircle, CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';

const FALLBACK_PRICES: Record<string, number> = { BTC: 103000, ETH: 2500, USDT: 1 };

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

function getUrgency(createdAt: string, status: string) {
  if (status !== 'PENDING') return null;
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3600000;
  if (ageHours >= 24) return { label: `${Math.floor(ageHours)}h — Critical`, class: 'text-rose-400 bg-rose-500/10', icon: 'critical' };
  if (ageHours >= 4) return { label: `${Math.floor(ageHours)}h — Overdue`, class: 'text-amber-400 bg-amber-500/10', icon: 'warning' };
  if (ageHours >= 1) return { label: `${Math.floor(ageHours)}h pending`, class: 'text-zinc-400 bg-white/5', icon: 'clock' };
  const mins = Math.floor(ageHours * 60);
  return { label: `${mins}m ago`, class: 'text-zinc-500 bg-white/5', icon: 'clock' };
}

async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch { toast.error('Copy failed'); }
}

export function TransactionManager() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [fiatInputs, setFiatInputs] = useState<Record<string, string>>({});
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>(FALLBACK_PRICES);
  const [pricesLoading, setPricesLoading] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd',
        { next: { revalidate: 300 } } as any
      );
      if (!res.ok) return;
      const data = await res.json();
      setPrices({
        BTC: data?.bitcoin?.usd ?? FALLBACK_PRICES.BTC,
        ETH: data?.ethereum?.usd ?? FALLBACK_PRICES.ETH,
        USDT: data?.tether?.usd ?? 1,
      });
    } catch { } finally { setPricesLoading(false); }
  }, []);

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 300000);
    return () => clearInterval(id);
  }, [fetchPrices]);

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
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
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
      tx.id.toLowerCase().includes(q) ||
      tx.id.slice(-6).toLowerCase().includes(q) ||
      (tx.user?.name?.toLowerCase() ?? '').includes(q) ||
      (tx.user?.email?.toLowerCase() ?? '').includes(q) ||
      (tx.transactionHash?.toLowerCase() ?? '').includes(q) ||
      (tx.bankName?.toLowerCase() ?? '').includes(q) ||
      (tx.accountNumber ?? '').includes(q) ||
      (tx.cryptoType?.toLowerCase() ?? '').includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sortDir === 'desc' ? -diff : diff;
  });

  const counts = {
    ALL: transactions.length,
    PENDING: transactions.filter((t: any) => t.status === 'PENDING').length,
    CONFIRMED: transactions.filter((t: any) => t.status === 'CONFIRMED').length,
    CREDITED: transactions.filter((t: any) => t.status === 'CREDITED').length,
    REJECTED: transactions.filter((t: any) => t.status === 'REJECTED').length,
  };

  const pendingUSDVolume = transactions
    .filter((t: any) => t.status === 'PENDING')
    .reduce((sum: number, t: any) => sum + (t.amountCrypto ?? 0) * (prices[t.cryptoType] ?? 0), 0);

  const totalUSDVolume = transactions
    .filter((t: any) => t.status !== 'REJECTED')
    .reduce((sum: number, t: any) => sum + (t.amountCrypto ?? 0) * (prices[t.cryptoType] ?? 0), 0);

  const tabs = [
    { key: 'ALL', label: 'All', count: counts.ALL },
    { key: 'PENDING', label: 'Pending', count: counts.PENDING, alert: counts.PENDING > 0 },
    { key: 'CONFIRMED', label: 'Confirmed', count: counts.CONFIRMED },
    { key: 'CREDITED', label: 'Completed', count: counts.CREDITED },
    { key: 'REJECTED', label: 'Rejected', count: counts.REJECTED },
  ];

  const displayed = statusFilter === 'ALL' ? sorted : sorted.filter((t: any) => t.status === statusFilter);

  const TxRow = ({ tx }: { tx: any }) => {
    const usdVal = (tx.amountCrypto ?? 0) * (prices[tx.cryptoType] ?? 0);
    const link = blockchainLink(tx.transactionHash, tx.cryptoType);
    const badge = statusBadge(tx.status);
    const isExpanded = expandedTx === tx.id;
    const isDone = tx.status === 'CREDITED' || tx.status === 'REJECTED';
    const urgency = getUrgency(tx.createdAt, tx.status);
    const [hovered, setHovered] = useState(false);

    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`rounded-xl border transition-all overflow-hidden ${
          isExpanded
            ? 'border-white/10 bg-white/[0.04]'
            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
        }`}
      >
        {/* Row */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          {/* Status Dot */}
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            tx.status === 'PENDING' ? 'bg-amber-400 animate-pulse' :
            tx.status === 'CONFIRMED' ? 'bg-cyan-400' :
            tx.status === 'CREDITED' ? 'bg-emerald-400' : 'bg-rose-400'
          }`} />

          {/* ID + copy */}
          <div className="flex-shrink-0 w-24 flex items-center gap-1 group/id">
            <span className="text-xs font-mono text-zinc-500">#{tx.id.slice(-6)}</span>
            <button
              onClick={e => { e.stopPropagation(); copyText(tx.id, 'Transaction ID'); }}
              className="opacity-0 group-hover/id:opacity-100 transition-opacity p-0.5 rounded text-zinc-600 hover:text-zinc-300"
              title="Copy full ID"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>

          {/* Customer */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => setExpandedTx(isExpanded ? null : tx.id)}
          >
            <p className="text-sm font-medium text-white truncate">{tx.user?.name ?? 'Unknown'}</p>
            <p className="text-xs text-zinc-500 truncate">{tx.user?.email ?? 'N/A'}</p>
          </div>

          {/* Amount */}
          <div
            className="flex-shrink-0 w-32 text-right hidden sm:block cursor-pointer"
            onClick={() => setExpandedTx(isExpanded ? null : tx.id)}
          >
            <p className="text-sm font-semibold text-white">{tx.amountCrypto} {tx.cryptoType}</p>
            <p className="text-xs text-zinc-500">≈ ${usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>

          {/* Urgency pill */}
          {urgency && (
            <div className={`flex-shrink-0 hidden md:flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${urgency.class}`}>
              {urgency.icon === 'critical' ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {urgency.label}
            </div>
          )}

          {/* Status Badge (hidden when urgency showing) */}
          {!urgency && (
            <div className="flex-shrink-0 w-28 hidden md:block">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.class}`}>
                {badge.label}
              </span>
            </div>
          )}

          {/* Date */}
          <div
            className="flex-shrink-0 w-24 text-right hidden lg:block cursor-pointer"
            onClick={() => setExpandedTx(isExpanded ? null : tx.id)}
          >
            <p className="text-xs text-zinc-400">{fmtShortDate(tx.createdAt)}</p>
            <p className="text-[10px] text-zinc-600">{new Date(tx.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          {/* Hover Quick Actions for PENDING */}
          {tx.status === 'PENDING' && hovered && !isExpanded && (
            <div className="flex-shrink-0 flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => updateTransaction(tx.id, { status: 'CONFIRMED', adminNote: 'Quick approved' })}
                disabled={actionLoading === tx.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                title="Quick approve"
              >
                {actionLoading === tx.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCheck className="h-3 w-3" />}
                Approve
              </button>
              <button
                onClick={() => updateTransaction(tx.id, { status: 'REJECTED', adminNote: 'Rejected by admin' })}
                disabled={actionLoading === tx.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600/80 text-white text-xs font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors"
                title="Quick reject"
              >
                <Ban className="h-3 w-3" />
                Reject
              </button>
            </div>
          )}

          {/* Hover Quick Action for CONFIRMED */}
          {tx.status === 'CONFIRMED' && hovered && !isExpanded && (
            <div className="flex-shrink-0 flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => updateTransaction(tx.id, { status: 'CREDITED', adminNote: 'Fiat credited' })}
                disabled={actionLoading === tx.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                {actionLoading === tx.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Banknote className="h-3 w-3" />}
                Mark Credited
              </button>
            </div>
          )}

          {/* Expand Toggle */}
          <button
            onClick={() => setExpandedTx(isExpanded ? null : tx.id)}
            className="flex-shrink-0 p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-5 pt-1 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  {/* Customer */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Customer
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Name</span>
                        <span className="text-white font-medium">{tx.user?.name ?? 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Email</span>
                        <span className="text-zinc-300">{tx.user?.email ?? 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-zinc-500 flex-shrink-0">Tx ID</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-zinc-400 font-mono text-[10px] truncate">{tx.id}</span>
                          <button onClick={() => copyText(tx.id, 'Transaction ID')} className="flex-shrink-0 p-0.5 text-zinc-600 hover:text-zinc-300 transition-colors">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Submitted</span>
                        <span className="text-zinc-400 text-xs">{fmtDate(tx.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Crypto */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                      <Bitcoin className="h-3 w-3" /> Crypto Deposit
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Amount</span>
                        <span className="text-white font-semibold">{tx.amountCrypto} {tx.cryptoType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">USD Value</span>
                        <span className="text-zinc-300">≈ ${usdVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-zinc-500 flex-shrink-0">Hash</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <a href={link} target="_blank" rel="noopener noreferrer"
                             className="text-[10px] font-mono text-cyan-400 hover:underline truncate">
                            {tx.transactionHash?.slice(0, 16)}…
                          </a>
                          <button onClick={() => copyText(tx.transactionHash, 'Hash')} className="flex-shrink-0 p-0.5 text-zinc-600 hover:text-zinc-300 transition-colors">
                            <Copy className="h-3 w-3" />
                          </button>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-0.5 text-zinc-600 hover:text-cyan-400 transition-colors">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payout */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" /> Payout Details
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Currency</span>
                        <span className="text-white font-semibold">{tx.fiatCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Bank</span>
                        <span className="text-zinc-300">{tx.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-zinc-500 flex-shrink-0">Account No.</span>
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-300 font-mono">{tx.accountNumber}</span>
                          <button onClick={() => copyText(tx.accountNumber, 'Account number')} className="p-0.5 text-zinc-600 hover:text-zinc-300 transition-colors">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Account Name</span>
                        <span className="text-zinc-300">{tx.accountName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Note */}
                {tx.adminNote && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-white/5 px-4 py-3 text-xs">
                    <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-indigo-400" />
                    <span className="text-zinc-300"><span className="text-white font-medium">Note:</span> {tx.adminNote}</span>
                  </div>
                )}

                {/* Approved payout */}
                {tx.amountFiat != null && (
                  <div className="mt-3 text-sm font-semibold text-emerald-400 bg-emerald-500/10 rounded-lg px-4 py-3 flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Approved Payout: {tx.fiatCurrency === 'NGN' ? '₦' : '£'}{Number(tx.amountFiat).toLocaleString()}
                  </div>
                )}

                {/* Admin Actions */}
                {!isDone && (
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3" /> Admin Decision
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          Fiat Payout Amount ({tx.fiatCurrency})
                        </label>
                        <input
                          type="number" step="any"
                          placeholder={`Enter ${tx.fiatCurrency} amount`}
                          value={fiatInputs[tx.id] ?? (tx.amountFiat != null ? String(tx.amountFiat) : '')}
                          onChange={e => setFiatInputs(p => ({ ...p, [tx.id]: e.target.value }))}
                          className="w-full mt-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Admin Note</label>
                        <input
                          type="text" placeholder="Reason or note..."
                          value={noteInputs[tx.id] ?? ''}
                          onChange={e => setNoteInputs(p => ({ ...p, [tx.id]: e.target.value }))}
                          className="w-full mt-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tx.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateTransaction(tx.id, {
                              status: 'CONFIRMED',
                              amountFiat: fiatInputs[tx.id] ?? tx.amountFiat ?? undefined,
                              adminNote: noteInputs[tx.id] || undefined,
                            })}
                            disabled={actionLoading === tx.id}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50 transition-colors"
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
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-500 disabled:opacity-50 transition-colors"
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
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === tx.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
                          Mark as Credited (Fiat Sent)
                        </button>
                      )}
                    </div>
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
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Title + live price ticker */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">Transaction Manager</h2>
            {(loading && transactions.length > 0) && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            {pricesLoading ? (
              <span className="text-xs text-zinc-600">Loading live prices…</span>
            ) : (
              <>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <span className="text-zinc-600">BTC</span>
                  <span className="text-white font-mono font-semibold">${prices.BTC.toLocaleString()}</span>
                </span>
                <span className="text-zinc-700">·</span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <span className="text-zinc-600">ETH</span>
                  <span className="text-white font-mono font-semibold">${prices.ETH.toLocaleString()}</span>
                </span>
                <span className="text-zinc-700">·</span>
                <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </>
            )}
          </div>
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            <input
              ref={searchRef}
              id="tx-search"
              type="text"
              placeholder="Search ID, name, email, hash…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 w-72 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-base leading-none">×</button>
            )}
          </div>
          <button
            onClick={() => fetchTransactions()}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Refresh (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {!loading && transactions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Total Volume */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 space-y-1">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Total Volume</p>
            <p className="text-2xl font-bold text-white tabular-nums">
              ${totalUSDVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-zinc-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {transactions.filter((t:any) => t.status !== 'REJECTED').length} transactions
            </p>
          </div>

          {/* Pending — only show when there are pending */}
          {counts.PENDING > 0 ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4 space-y-1">
              <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Needs Action
              </p>
              <p className="text-2xl font-bold text-amber-400 tabular-nums">
                ${pendingUSDVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[11px] text-amber-600">{counts.PENDING} pending · review now</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 space-y-1">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-zinc-600 tabular-nums">—</p>
              <p className="text-[11px] text-zinc-700">All clear</p>
            </div>
          )}

          {/* Completed */}
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-5 py-4 space-y-1">
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-emerald-400 tabular-nums">{counts.CREDITED}</p>
            <p className="text-[11px] text-emerald-700">{counts.CONFIRMED} awaiting credit</p>
          </div>

          {/* Success Rate */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 space-y-1">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Success Rate</p>
            <p className="text-2xl font-bold text-white tabular-nums">
              {counts.ALL > 0 ? Math.round((counts.CREDITED / Math.max(counts.ALL - counts.REJECTED, 1)) * 100) : 0}%
            </p>
            <p className="text-[11px] text-zinc-600">{counts.REJECTED} rejected total</p>
          </div>
        </div>
      )}

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
                (tab as any).alert && tab.key === 'PENDING'
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
          <p className="text-sm">{search ? `No results for "${search}"` : 'No transactions found'}</p>
          {search && (
            <button onClick={() => setSearch('')} className="mt-2 text-xs text-indigo-400 hover:underline">Clear search</button>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* Column Headers */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-600 font-bold">
            <div className="w-2 flex-shrink-0" />
            <div className="w-24 flex-shrink-0">ID</div>
            <div className="flex-1">Customer</div>
            <div className="w-32 text-right flex-shrink-0">Amount</div>
            <div className="w-28 flex-shrink-0">Status / Age</div>
            <button
              onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
              className="w-24 text-right flex-shrink-0 flex items-center justify-end gap-1 hover:text-zinc-400 transition-colors"
            >
              <ArrowUpDown className="h-3 w-3" />
              {sortDir === 'desc' ? 'Newest' : 'Oldest'}
            </button>
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
