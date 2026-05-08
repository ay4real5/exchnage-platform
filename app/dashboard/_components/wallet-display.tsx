'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bitcoin, Copy, Check, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const cryptoIcons: Record<string, { color: string; label: string }> = {
  BTC: { color: 'text-orange-500', label: 'Bitcoin' },
  USDT: { color: 'text-emerald-500', label: 'Tether (USDT)' },
  ETH: { color: 'text-blue-500', label: 'Ethereum' },
};

export function WalletDisplay() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyAddress = async (id: string, address: string) => {
    try {
      await navigator?.clipboard?.writeText?.(address);
      setCopiedId(id);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error: any) {
      console.error('Copy error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if ((wallets?.length ?? 0) === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">No Wallet Addresses Available</h3>
          <p className="text-sm text-muted-foreground">Wallet addresses will appear here once the admin adds them.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Deposit Addresses</h2>
        <p className="text-sm text-muted-foreground">Send crypto to one of the addresses below, then submit your transaction details.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(wallets ?? []).map((wallet: any, i: number) => {
          const cryptoInfo = cryptoIcons?.[wallet?.cryptoType] ?? { color: 'text-primary', label: wallet?.cryptoType ?? 'Unknown' };
          return (
            <motion.div
              key={wallet?.id ?? i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card variant="interactive">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${cryptoInfo.color}`}>
                      {wallet?.cryptoType === 'BTC' ? <Bitcoin className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-base">{cryptoInfo.label}</CardTitle>
                      {wallet?.label && <CardDescription>{wallet.label}</CardDescription>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-lg bg-muted p-3 text-xs font-mono break-all">
                      {wallet?.address ?? ''}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyAddress(wallet?.id ?? '', wallet?.address ?? '')}
                    >
                      {copiedId === wallet?.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
