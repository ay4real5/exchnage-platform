'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Hash, Coins, Building2, CreditCard, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SendDrawer({ open, onClose, prefillCrypto, prefillAmount }: { open: boolean; onClose: () => void; prefillCrypto?: string; prefillAmount?: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    cryptoType: prefillCrypto ?? 'BTC',
    amountCrypto: prefillAmount ?? '',
    transactionHash: '',
    fiatCurrency: 'NGN',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const update = (field: string, value: string) => setForm((p: any) => ({ ...p, [field]: value }));

  const canNext = step === 1
    ? form.amountCrypto && parseFloat(form.amountCrypto) > 0 && form.transactionHash
    : form.bankName && form.accountNumber && form.accountName;

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { toast.error(data?.error ?? 'Failed'); setLoading(false); return; }
      setDone(true);
    } catch { toast.error('Error'); }
    setLoading(false);
  };

  const reset = () => { setStep(1); setDone(false); setForm({ cryptoType: 'BTC', amountCrypto: '', transactionHash: '', fiatCurrency: 'NGN', bankName: '', accountNumber: '', accountName: '' }); };

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
                <h3 className="font-display font-bold text-lg">Send Crypto</h3>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"><X className="h-4 w-4" /></button>
              </div>

              {/* Step bar */}
              {!done && (
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" animate={{ width: s <= step ? '100%' : '0%' }} />
                    </div>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Submitted!</h4>
                    <p className="text-sm text-zinc-400 mb-6">We will verify and credit your account.</p>
                    <Button className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white rounded-xl" onClick={() => { reset(); onClose(); }}>Done</Button>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Cryptocurrency</label>
                      <select value={form.cryptoType} onChange={(e: any) => update('cryptoType', e.target.value)} className="w-full bg-transparent text-lg font-bold text-white focus:outline-none">
                        {['BTC', 'USDT', 'ETH'].map((c) => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                      </select>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Amount</label>
                      <input type="number" step="any" value={form.amountCrypto} onChange={(e: any) => update('amountCrypto', e.target.value)} placeholder="0.00" className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-zinc-700 focus:outline-none tabular-nums" />
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Transaction Hash</label>
                      <input value={form.transactionHash} onChange={(e: any) => update('transactionHash', e.target.value)} placeholder="Paste hash..." className="w-full bg-transparent text-sm font-mono text-white placeholder:text-zinc-700 focus:outline-none" />
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Fiat Currency</label>
                      <select value={form.fiatCurrency} onChange={(e: any) => update('fiatCurrency', e.target.value)} className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none">
                        {['NGN', 'GBP'].map((f) => <option key={f} value={f} className="bg-zinc-900">{f}</option>)}
                      </select>
                    </div>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Bank Name</label>
                      <input value={form.bankName} onChange={(e: any) => update('bankName', e.target.value)} placeholder="Enter bank name" className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none" />
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Account Number</label>
                      <input value={form.accountNumber} onChange={(e: any) => update('accountNumber', e.target.value)} placeholder="Enter account number" className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none tabular-nums" />
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Account Name</label>
                      <input value={form.accountName} onChange={(e: any) => update('accountName', e.target.value)} placeholder="Enter account holder name" className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                    <h4 className="text-sm font-semibold mb-2">Review</h4>
                    {[
                      { label: 'Crypto', value: `${form.amountCrypto} ${form.cryptoType}` },
                      { label: 'Hash', value: form.transactionHash },
                      { label: 'Fiat', value: form.fiatCurrency },
                      { label: 'Bank', value: form.bankName },
                      { label: 'Account', value: `${form.accountNumber} (${form.accountName})` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm py-2 border-b border-white/5">
                        <span className="text-zinc-500">{item.label}</span>
                        <span className="text-white font-medium truncate max-w-[200px]">{item.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {!done && (
                <div className="flex gap-3 mt-6">
                  {step > 1 && (
                    <Button variant="outline" className="flex-1 border-zinc-700 text-white hover:bg-zinc-800 rounded-xl" onClick={() => setStep(step - 1)}>Back</Button>
                  )}
                  {step < 3 ? (
                    <Button className="flex-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white rounded-xl" disabled={!canNext} onClick={() => setStep(step + 1)}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
                  ) : (
                    <Button className="flex-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white rounded-xl" disabled={loading} onClick={submit}>
                      {loading ? 'Submitting...' : <><Send className="h-4 w-4 mr-1" /> Submit</>}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
