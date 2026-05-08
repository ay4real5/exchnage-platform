'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Pencil, Wallet, Save, X, Loader2, Bitcoin } from 'lucide-react';
import { toast } from 'sonner';

export function WalletManager() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ cryptoType: '', address: '', label: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await fetch('/api/wallets');
      const data = await res.json();
      setWallets(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch wallets error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form?.cryptoType || !form?.address) {
      toast.error('Crypto type and address are required');
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/wallets/${editingId}` : '/api/wallets';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error ?? 'Failed to save wallet');
        return;
      }
      toast.success(editingId ? 'Wallet updated!' : 'Wallet added!');
      setForm({ cryptoType: '', address: '', label: '' });
      setShowForm(false);
      setEditingId(null);
      fetchWallets();
    } catch (error: any) {
      console.error('Save wallet error:', error);
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this wallet address?')) return;
    try {
      const res = await fetch(`/api/wallets/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete wallet');
        return;
      }
      toast.success('Wallet deleted!');
      fetchWallets();
    } catch (error: any) {
      console.error('Delete wallet error:', error);
      toast.error('Something went wrong');
    }
  };

  const startEdit = (wallet: any) => {
    setForm({
      cryptoType: wallet?.cryptoType ?? '',
      address: wallet?.address ?? '',
      label: wallet?.label ?? '',
    });
    setEditingId(wallet?.id ?? null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Wallet Addresses</h2>
          <p className="text-sm text-muted-foreground">Manage deposit wallet addresses shown to customers</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ cryptoType: '', address: '', label: '' }); }}>
          {showForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
          {showForm ? 'Cancel' : 'Add Wallet'}
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{editingId ? 'Edit Wallet' : 'Add New Wallet'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cryptocurrency</Label>
                  <Select value={form?.cryptoType ?? ''} onValueChange={(val: string) => setForm((p: any) => ({ ...(p ?? {}), cryptoType: val }))}>
                    <SelectTrigger><SelectValue placeholder="Select crypto" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Wallet Address</Label>
                  <Input
                    placeholder="Paste wallet address"
                    value={form?.address ?? ''}
                    onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), address: e?.target?.value ?? '' }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Label (optional)</Label>
                  <Input
                    placeholder="E.g. Main BTC wallet"
                    value={form?.label ?? ''}
                    onChange={(e: any) => setForm((p: any) => ({ ...(p ?? {}), label: e?.target?.value ?? '' }))}
                  />
                </div>
              </div>
              <Button onClick={handleSave} loading={saving}>
                <Save className="h-4 w-4 mr-1" /> {editingId ? 'Update' : 'Save'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-3">
        {(wallets ?? []).map((wallet: any, i: number) => (
          <motion.div
            key={wallet?.id ?? i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {wallet?.cryptoType === 'BTC' ? <Bitcoin className="h-5 w-5 text-orange-500" /> : <Wallet className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{wallet?.cryptoType ?? ''}</span>
                        {wallet?.label && <Badge variant="secondary" className="text-xs">{wallet.label}</Badge>}
                        <Badge variant={wallet?.isActive ? 'default' : 'outline'} className="text-xs">
                          {wallet?.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground break-all">{wallet?.address ?? ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon-sm" onClick={() => startEdit(wallet)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon-sm" onClick={() => handleDelete(wallet?.id ?? '')} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {(wallets?.length ?? 0) === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No wallet addresses yet. Add one above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
