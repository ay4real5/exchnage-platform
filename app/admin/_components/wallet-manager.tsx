'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Pencil, Save, X, Loader2, Copy,
  QrCode, Upload, CheckCircle2, Power, PowerOff, ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

const CRYPTO_META: Record<string, { color: string; bg: string; border: string; symbol: string; icon: string }> = {
  BTC: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', symbol: '₿', icon: '🟠' },
  ETH: { color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', symbol: 'Ξ', icon: '🔵' },
  USDT: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', symbol: '₮', icon: '🟢' },
};

const EMPTY_FORM = { cryptoType: '', address: '', label: '', qrCode: '' };

export function WalletManager() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchWallets(); }, []);

  const fetchWallets = async () => {
    try {
      const res = await fetch('/api/wallets');
      const data = await res.json();
      setWallets(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load wallets'); }
    finally { setLoading(false); }
  };

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, qrCode: ev.target?.result as string ?? '' }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.cryptoType || !form.address) {
      toast.error('Crypto type and address are required');
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/wallets/${editingId}` : '/api/wallets';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { toast.error((await res.json())?.error ?? 'Failed to save'); return; }
      toast.success(editingId ? 'Wallet updated!' : 'Wallet added!');
      setForm(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      fetchWallets();
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this wallet address?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/wallets/${id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Failed to delete'); return; }
      toast.success('Wallet deleted');
      fetchWallets();
    } catch { toast.error('Something went wrong'); }
    finally { setDeletingId(null); }
  };

  const handleToggleActive = async (wallet: any) => {
    setTogglingId(wallet.id);
    try {
      const res = await fetch(`/api/wallets/${wallet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !wallet.isActive }),
      });
      if (!res.ok) { toast.error('Failed to update'); return; }
      toast.success(wallet.isActive ? 'Wallet deactivated' : 'Wallet activated');
      fetchWallets();
    } catch { toast.error('Something went wrong'); }
    finally { setTogglingId(null); }
  };

  const startEdit = (wallet: any) => {
    setForm({
      cryptoType: wallet.cryptoType ?? '',
      address: wallet.address ?? '',
      label: wallet.label ?? '',
      qrCode: wallet.qrCode ?? '',
    });
    setEditingId(wallet.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied');
    } catch { toast.error('Copy failed'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Wallet Addresses</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Manage deposit addresses shown to customers</p>
        </div>
        <button
          onClick={() => { setShowForm(s => !s); setEditingId(null); setForm(EMPTY_FORM); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            showForm
              ? 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
          }`}
        >
          {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Wallet</>}
        </button>
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h3 className="text-base font-bold text-white mb-5">
              {editingId ? 'Edit Wallet' : 'New Wallet Address'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left — fields */}
              <div className="space-y-4">
                {/* Crypto Type */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cryptocurrency</label>
                  <div className="flex gap-2 mt-2">
                    {['BTC', 'ETH', 'USDT'].map(c => {
                      const m = CRYPTO_META[c];
                      return (
                        <button
                          key={c}
                          onClick={() => setForm(p => ({ ...p, cryptoType: c }))}
                          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                            form.cryptoType === c
                              ? `${m.bg} ${m.border} ${m.color}`
                              : 'border-white/5 bg-white/[0.02] text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                          }`}
                        >
                          <span className="text-lg">{m.icon}</span>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Wallet Address</label>
                  <input
                    type="text"
                    placeholder="Paste full wallet address…"
                    value={form.address}
                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    className="w-full mt-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                {/* Label */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Label <span className="normal-case text-zinc-600">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Main BTC Wallet"
                    value={form.label}
                    onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                    className="w-full mt-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              {/* Right — QR Upload */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">QR Code Image</label>
                <div className="mt-2">
                  {form.qrCode ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
                      <img src={form.qrCode} alt="QR Code" className="w-full max-h-52 object-contain p-4" />
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 bg-black/60 transition-all">
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
                        >
                          <Upload className="h-3.5 w-3.5" /> Replace
                        </button>
                        <button
                          onClick={() => setForm(p => ({ ...p, qrCode: '' }))}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/30"
                        >
                          <X className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full h-52 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-white/5 group-hover:bg-indigo-500/10 flex items-center justify-center transition-colors">
                        <QrCode className="h-6 w-6 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors">Upload QR Code</p>
                        <p className="text-[11px] text-zinc-600 mt-0.5">PNG, JPG up to 2MB</p>
                      </div>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleQRUpload} />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex gap-3 mt-6 pt-5 border-t border-white/5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingId ? 'Update Wallet' : 'Save Wallet'}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 text-sm font-semibold hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Cards Grid */}
      {wallets.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] py-20 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="text-sm font-semibold text-zinc-400">No wallet addresses yet</p>
          <p className="text-xs text-zinc-600 mt-1">Add a wallet above to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {wallets.map((wallet, i) => {
              const meta = CRYPTO_META[wallet.cryptoType] ?? CRYPTO_META.BTC;
              return (
                <motion.div
                  key={wallet.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className={`rounded-2xl border ${meta.border} bg-white/[0.025] overflow-hidden group transition-all hover:bg-white/[0.04]`}
                >
                  {/* Card Header */}
                  <div className={`px-5 py-4 flex items-center justify-between ${meta.bg}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meta.icon}</span>
                      <div>
                        <p className={`text-sm font-bold ${meta.color}`}>{wallet.cryptoType}</p>
                        {wallet.label && <p className="text-[11px] text-zinc-500">{wallet.label}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        wallet.isActive
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-zinc-500/15 text-zinc-500'
                      }`}>
                        {wallet.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="px-5 pt-4 pb-2 flex justify-center">
                    {wallet.qrCode ? (
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-white p-2 w-36 h-36 flex items-center justify-center">
                        <img src={wallet.qrCode} alt="QR" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 w-36 h-36 flex flex-col items-center justify-center gap-2 text-zinc-600">
                        <ImageIcon className="h-7 w-7" />
                        <p className="text-[10px]">No QR uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="px-5 py-3">
                    <div className="flex items-center gap-2 rounded-xl bg-black/20 border border-white/5 px-3 py-2.5 group/addr">
                      <p className="text-[11px] font-mono text-zinc-400 flex-1 truncate">{wallet.address}</p>
                      <button
                        onClick={() => copyAddress(wallet.address)}
                        className="flex-shrink-0 p-1 text-zinc-600 hover:text-zinc-300 transition-colors"
                        title="Copy address"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-4 flex items-center gap-2">
                    <button
                      onClick={() => startEdit(wallet)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(wallet)}
                      disabled={togglingId === wallet.id}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        wallet.isActive
                          ? 'border-amber-500/20 text-amber-500 hover:bg-amber-500/10'
                          : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                      title={wallet.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {togglingId === wallet.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : wallet.isActive
                          ? <><PowerOff className="h-3.5 w-3.5" /> Deactivate</>
                          : <><Power className="h-3.5 w-3.5" /> Activate</>
                      }
                    </button>
                    <button
                      onClick={() => handleDelete(wallet.id)}
                      disabled={deletingId === wallet.id}
                      className="p-2 rounded-xl border border-rose-500/10 text-rose-500/50 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                      title="Delete wallet"
                    >
                      {deletingId === wallet.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />
                      }
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
