'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { History, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch transactions error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if ((transactions?.length ?? 0) === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">No Transactions Yet</h3>
          <p className="text-sm text-muted-foreground">Your transactions will appear here once you submit them.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-1">
          <History className="h-5 w-5 text-primary" /> Transaction History
        </h2>
        <p className="text-sm text-muted-foreground">Track the status of your submitted transactions</p>
      </div>
      <div className="space-y-3">
        {(transactions ?? []).map((tx: any, i: number) => (
          <motion.div
            key={tx?.id ?? i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card variant="interactive">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{tx?.amountCrypto ?? 0} {tx?.cryptoType ?? ''}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold">
                        {tx?.amountFiat != null ? `${tx.fiatCurrency === 'NGN' ? '₦' : '£'}${Number(tx.amountFiat).toLocaleString()}` : 'Awaiting conversion'}
                      </span>
                      <span className="text-xs text-muted-foreground">({tx?.fiatCurrency ?? ''})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="font-mono truncate max-w-[200px]">{tx?.transactionHash ?? ''}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {tx?.bankName ?? ''} • {tx?.accountNumber ?? ''} • {tx?.accountName ?? ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={tx?.status ?? 'PENDING'} />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {tx?.createdAt ? format(new Date(tx.createdAt), 'MMM dd, yyyy') : ''}
                    </span>
                  </div>
                </div>
                {tx?.adminNote && (
                  <div className="mt-2 p-2 rounded-md bg-muted text-xs text-muted-foreground">
                    <span className="font-medium">Admin note:</span> {tx.adminNote}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
