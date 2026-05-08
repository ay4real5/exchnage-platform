'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Hash, Coins, Building2, CreditCard, User } from 'lucide-react';
import { toast } from 'sonner';

export function TransactionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cryptoType: '',
    amountCrypto: '',
    transactionHash: '',
    fiatCurrency: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const updateField = (field: string, value: string) => {
    setForm((prev: any) => ({ ...(prev ?? {}), [field]: value }));
  };

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
      setForm({
        cryptoType: '',
        amountCrypto: '',
        transactionHash: '',
        fiatCurrency: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
      });
      onSuccess?.();
    } catch (error: any) {
      console.error('Submit transaction error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" /> Submit Transaction
        </CardTitle>
        <CardDescription>After sending crypto to our wallet, submit the details below for verification.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cryptocurrency Sent</Label>
              <Select value={form?.cryptoType ?? ''} onValueChange={(val: string) => updateField('cryptoType', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crypto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount Sent</Label>
              <div className="relative">
                <Coins className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={form?.amountCrypto ?? ''}
                  onChange={(e: any) => updateField('amountCrypto', e?.target?.value ?? '')}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transaction Hash</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Paste your transaction hash here"
                value={form?.transactionHash ?? ''}
                onChange={(e: any) => updateField('transactionHash', e?.target?.value ?? '')}
                className="pl-10 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Fiat Currency</Label>
            <Select value={form?.fiatCurrency ?? ''} onValueChange={(val: string) => updateField('fiatCurrency', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select fiat currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                <SelectItem value="GBP">British Pounds (GBP)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Bank Account Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Bank Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter bank name"
                    value={form?.bankName ?? ''}
                    onChange={(e: any) => updateField('bankName', e?.target?.value ?? '')}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter account number"
                    value={form?.accountNumber ?? ''}
                    onChange={(e: any) => updateField('accountNumber', e?.target?.value ?? '')}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter account holder name"
                    value={form?.accountName ?? ''}
                    onChange={(e: any) => updateField('accountName', e?.target?.value ?? '')}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            <Send className="h-4 w-4 mr-1" /> Submit Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
