'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Hash, Coins, Building2, CreditCard, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export function TransactionForm({ onSuccess }: { onSuccess?: () => void }) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    cryptoType: '',
    amountCrypto: '',
    transactionHash: '',
    fiatCurrency: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  useEffect(() => {
    const crypto = searchParams?.get('crypto');
    const amount = searchParams?.get('amount');
    if (crypto) setForm((p) => ({ ...p, cryptoType: crypto }));
    if (amount) setForm((p) => ({ ...p, amountCrypto: amount }));
  }, [searchParams]);

  const updateField = (field: string, value: string) => {
    setForm((prev: any) => ({ ...(prev ?? {}), [field]: value }));
  };

  const fiatSymbol = form.fiatCurrency === 'GBP' ? '£' : '₦';

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    const { cryptoType, amountCrypto, transactionHash, fiatCurrency, bankName, accountNumber, accountName } = form ?? {};
    if (!cryptoType || !amountCrypto || !transactionHash || !fiatCurrency || !bankName || !accountNumber || !accountName) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? 'Failed to submit transaction');
        return;
      }
      toast.success('Transaction submitted successfully! We will verify and process it.');
      setSubmitted(true);
    } catch (error: any) {
      console.error('Submit transaction error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8 text-white text-center"
      >
        <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="font-display text-xl font-bold mb-2">Transaction Submitted!</h3>
        <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
          We have received your details and will verify the blockchain transaction. You will be credited once confirmed.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard">
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Overview
            </Button>
          </Link>
          <Button
            className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 hover:opacity-90 text-white"
            onClick={() => { setSubmitted(false); setForm({ cryptoType: '', amountCrypto: '', transactionHash: '', fiatCurrency: '', bankName: '', accountNumber: '', accountName: '' }); }}
          >
            Submit Another
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-6">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-indigo-400" /> Submit Transaction
          </h3>
          <p className="text-xs text-zinc-400 mt-1">After sending crypto to our wallet, submit the details below for verification.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Cryptocurrency Sent</Label>
              <select
                value={form.cryptoType}
                onChange={(e: any) => updateField('cryptoType', e.target.value)}
                className="w-full bg-zinc-900/70 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select crypto</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Amount Sent</Label>
              <div className="relative">
                <Coins className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={form.amountCrypto}
                  onChange={(e: any) => updateField('amountCrypto', e.target.value)}
                  className="pl-10 bg-zinc-900/70 border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm">Transaction Hash</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Paste your transaction hash here"
                value={form.transactionHash}
                onChange={(e: any) => updateField('transactionHash', e.target.value)}
                className="pl-10 bg-zinc-900/70 border-zinc-700/50 rounded-xl text-white font-mono text-sm placeholder:text-zinc-600 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm">Preferred Fiat Currency</Label>
            <select
              value={form.fiatCurrency}
              onChange={(e: any) => updateField('fiatCurrency', e.target.value)}
              className="w-full bg-zinc-900/70 border border-zinc-700/50 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select fiat currency</option>
              <option value="NGN">Nigerian Naira (NGN)</option>
              <option value="GBP">British Pounds (GBP)</option>
            </select>
          </div>

          <div className="border-t border-zinc-800 pt-5">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm text-zinc-200">
              <Building2 className="h-4 w-4 text-indigo-400" /> Bank Account Details
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-zinc-300 text-sm">Bank Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Enter bank name"
                    value={form.bankName}
                    onChange={(e: any) => updateField('bankName', e.target.value)}
                    className="pl-10 bg-zinc-900/70 border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300 text-sm">Account Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Enter account number"
                    value={form.accountNumber}
                    onChange={(e: any) => updateField('accountNumber', e.target.value)}
                    className="pl-10 bg-zinc-900/70 border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300 text-sm">Account Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Enter account holder name"
                    value={form.accountName}
                    onChange={(e: any) => updateField('accountName', e.target.value)}
                    className="pl-10 bg-zinc-900/70 border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 hover:opacity-90 text-white font-semibold h-12 rounded-xl"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Submit Transaction
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
