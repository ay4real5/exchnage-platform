'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowRight, CheckCircle2, Wallet, Landmark, Receipt, Copy, Check, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useSWR from 'swr';
import { QRCodeSVG } from 'qrcode.react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const cryptoMeta: Record<string, { color: string; border: string; bg: string; priceKey: string }> = {
  BTC: { color: '#F7931A', border: 'border-orange-500/40', bg: 'bg-orange-500/10', priceKey: 'bitcoin' },
  USDT: { color: '#26A17B', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', priceKey: 'tether' },
  ETH: { color: '#627EEA', border: 'border-blue-500/40', bg: 'bg-blue-500/10', priceKey: 'ethereum' },
};

const demoRates: Record<string, number> = { BTC: 64000, USDT: 1, ETH: 3400 };

const walletAddresses: Record<string, string> = {
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
};

export function SendDrawer({ open, onClose, prefillCrypto, prefillAmount }: { open: boolean; onClose: () => void; prefillCrypto?: string; prefillAmount?: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: prices } = useSWR('/api/prices', fetcher, { refreshInterval: 60000 });

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

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddresses[form.cryptoType]);
      setCopied(true);
      toast.success('Address copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const usdPrice = prices?.[cryptoMeta[form.cryptoType].priceKey]?.usd ?? demoRates[form.cryptoType];
  const usdValue = form.amountCrypto ? parseFloat(form.amountCrypto) * usdPrice : 0;

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

  const steps = [
    { num: 1, label: 'Wallet', icon: Wallet },
    { num: 2, label: 'Payout', icon: Landmark },
    { num: 3, label: 'Confirm', icon: Receipt },
  ];

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
                <h3 className="font-display font-bold text-lg">{done ? 'Done' : 'Send Crypto'}</h3>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"><X className="h-4 w-4" /></button>
              </div>

              {/* Step circles */}
              {!done && (
                <div className="flex items-center gap-3 mb-6">
                  {steps.map((s, i) => {
                    const active = s.num === step;
                    const completed = s.num < step;
                    const Icon = s.icon;
                    return (
                      <div key={s.num} className="flex items-center gap-3 flex-1">
                        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-colors ${active ? 'bg-white/10' : completed ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white' : completed ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                            {completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.num}
                          </div>
                          <span className={`text-[11px] font-medium ${active ? 'text-white' : completed ? 'text-emerald-400' : 'text-zinc-600'}`}>{s.label}</span>
                        </div>
                        {i < steps.length - 1 && <div className="flex-1 h-px bg-zinc-800" />}
                      </div>
                    );
                  })}
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
                  <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    {/* Crypto cards */}
                    <div className="grid grid-cols-3 gap-2">
                      {['BTC', 'USDT', 'ETH'].map((c) => {
                        const meta = cryptoMeta[c];
                        const selected = form.cryptoType === c;
                        return (
                          <button
                            key={c}
                            onClick={() => update('cryptoType', c)}
                            className={`relative rounded-2xl border p-3 text-center transition-all ${selected ? `${meta.border} ${meta.bg}` : 'border-white/5 bg-white/5 hover:bg-white/[0.07]'}`}
                          >
                            {selected && <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />}
                            <p className="text-sm font-bold" style={{ color: selected ? meta.color : '#71717a' }}>{c}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Deposit card — QR + address */}
                    <div className={`rounded-2xl border p-4 space-y-3 ${cryptoMeta[form.cryptoType].border} bg-white/[0.03]`}>
                      <div className="flex items-center gap-2 mb-1">
                        <ScanLine className="h-4 w-4" style={{ color: cryptoMeta[form.cryptoType].color }} />
                        <span className="text-xs font-semibold text-zinc-300">Deposit {form.cryptoType}</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="p-2 bg-white rounded-lg">
                          <QRCodeSVG value={walletAddresses[form.cryptoType]} size={140} level="M" bgColor="#ffffff" fgColor="#000000" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-lg bg-black/30 border border-white/5 p-2.5 text-[11px] font-mono break-all text-zinc-300">{walletAddresses[form.cryptoType]}</code>
                        <Button variant="outline" size="icon" className="border-zinc-700 hover:bg-zinc-800 text-zinc-400 shrink-0" onClick={copyAddress}>
                          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                      <Button
                        className="w-full h-9 rounded-xl text-xs"
                        style={{ background: cryptoMeta[form.cryptoType].color, color: '#fff' }}
                        onClick={copyAddress}
                      >
                        {copied ? 'Copied!' : <>Copy Address <Copy className="h-3.5 w-3.5 ml-1.5" /></>}
                      </Button>
                      <p className="text-[10px] text-zinc-500 text-center">Send from your wallet, then enter details below</p>
                    </div>

                    {/* Amount */}
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4 focus-within:border-indigo-500/30 transition-colors">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Amount Sent</label>
                      <input type="number" step="any" value={form.amountCrypto} onChange={(e: any) => update('amountCrypto', e.target.value)} placeholder="0.00" className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-zinc-700 focus:outline-none tabular-nums" />
                      {usdValue > 0 && (
                        <p className="text-xs text-zinc-500 mt-1">≈ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      )}
                    </div>

                    {/* Hash */}
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4 focus-within:border-indigo-500/30 transition-colors">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Transaction Hash</label>
                      <input value={form.transactionHash} onChange={(e: any) => update('transactionHash', e.target.value)} placeholder="Paste blockchain hash..." className="w-full bg-transparent text-sm font-mono text-white placeholder:text-zinc-700 focus:outline-none" />
                    </div>

                    {/* Fiat */}
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Receive Currency</label>
                      <div className="flex gap-2">
                        {['NGN', 'GBP'].map((f) => (
                          <button
                            key={f}
                            onClick={() => update('fiatCurrency', f)}
                            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${form.fiatCurrency === f ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <Landmark className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Payout Account</h4>
                        <p className="text-[10px] text-zinc-500">Where we send your fiat</p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4 focus-within:border-indigo-500/30 transition-colors">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Bank Name</label>
                      <input value={form.bankName} onChange={(e: any) => update('bankName', e.target.value)} placeholder="e.g. First Bank" className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none" />
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4 focus-within:border-indigo-500/30 transition-colors">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Account Number</label>
                      <input value={form.accountNumber} onChange={(e: any) => update('accountNumber', e.target.value)} placeholder="10 digit number" className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none tabular-nums" />
                    </div>
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-4 focus-within:border-indigo-500/30 transition-colors">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 block">Account Name</label>
                      <input value={form.accountName} onChange={(e: any) => update('accountName', e.target.value)} placeholder="Full name on account" className="w-full bg-transparent text-white placeholder:text-zinc-700 focus:outline-none" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
                      <h4 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Summary</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">Sending</span>
                          <span className="text-sm font-bold">{form.amountCrypto} {form.cryptoType}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">Value</span>
                          <span className="text-sm text-zinc-300">≈ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">Receiving</span>
                          <span className="text-sm font-bold text-emerald-400">{form.fiatCurrency}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">Bank</span>
                          <span className="text-sm text-white">{form.bankName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">Account</span>
                          <span className="text-sm text-white font-mono">{form.accountNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                      <p className="text-[11px] text-amber-300">Double-check your details. Transactions cannot be reversed once submitted.</p>
                    </div>
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
                    <Button className="flex-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white rounded-xl h-11" disabled={loading} onClick={submit}>
                      {loading ? 'Submitting...' : <><Send className="h-4 w-4 mr-1.5" /> Confirm & Submit</>}
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
