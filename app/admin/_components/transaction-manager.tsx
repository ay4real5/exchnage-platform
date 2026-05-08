'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/status-badge';
import { CheckCircle2, Banknote, XCircle, Loader2, FileStack, ExternalLink, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function TransactionManager() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [fiatInputs, setFiatInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions?status=${filter}`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch transactions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, updates: any) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error ?? 'Failed to update');
        return;
      }
      toast.success('Transaction updated!');
      fetchTransactions();
    } catch (error: any) {
      console.error('Update transaction error:', error);
      toast.error('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <FileStack className="h-5 w-5 text-primary" /> All Transactions
          </h2>
          <p className="text-sm text-muted-foreground">Review, verify, and process customer transactions</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CREDITED">Credited</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (transactions?.length ?? 0) === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <FileStack className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No transactions found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {(transactions ?? []).map((tx: any, i: number) => (
            <motion.div
              key={tx?.id ?? i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-4 space-y-3">
                  {/* Header row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">{tx?.amountCrypto ?? 0} {tx?.cryptoType ?? ''}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-sm text-muted-foreground">{tx?.fiatCurrency ?? ''}</span>
                        <StatusBadge status={tx?.status ?? 'PENDING'} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        By: {tx?.user?.name ?? 'Unknown'} ({tx?.user?.email ?? ''}) •{' '}
                        {tx?.createdAt ? format(new Date(tx.createdAt), 'MMM dd, yyyy HH:mm') : ''}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Transaction Hash:</p>
                      <div className="flex items-center gap-1">
                        <code className="font-mono text-xs break-all bg-muted p-1.5 rounded">{tx?.transactionHash ?? ''}</code>
                        <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Bank Details:</p>
                      <p className="text-sm">{tx?.bankName ?? ''} • {tx?.accountNumber ?? ''} • {tx?.accountName ?? ''}</p>
                    </div>
                  </div>

                  {/* Fiat amount input & admin actions */}
                  {tx?.status !== 'CREDITED' && tx?.status !== 'REJECTED' && (
                    <div className="flex flex-col sm:flex-row items-end gap-3 pt-2 border-t">
                      <div className="flex-1 w-full sm:w-auto space-y-1">
                        <Label className="text-xs">Fiat Amount ({tx?.fiatCurrency ?? ''})</Label>
                        <Input
                          type="number"
                          step="any"
                          placeholder={`Amount in ${tx?.fiatCurrency ?? 'fiat'}`}
                          value={fiatInputs?.[tx?.id] ?? (tx?.amountFiat != null ? String(tx.amountFiat) : '')}
                          onChange={(e: any) => setFiatInputs((p: any) => ({ ...(p ?? {}), [tx?.id]: e?.target?.value ?? '' }))}
                          size="sm"
                        />
                      </div>
                      <div className="flex-1 w-full sm:w-auto space-y-1">
                        <Label className="text-xs">Admin Note</Label>
                        <Input
                          placeholder="Optional note"
                          value={noteInputs?.[tx?.id] ?? ''}
                          onChange={(e: any) => setNoteInputs((p: any) => ({ ...(p ?? {}), [tx?.id]: e?.target?.value ?? '' }))}
                          size="sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        {tx?.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateTransaction(tx?.id ?? '', {
                                status: 'CONFIRMED',
                                amountFiat: fiatInputs?.[tx?.id] ?? tx?.amountFiat ?? undefined,
                                adminNote: noteInputs?.[tx?.id] || undefined,
                              })}
                              loading={actionLoading === tx?.id}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateTransaction(tx?.id ?? '', {
                                status: 'REJECTED',
                                adminNote: noteInputs?.[tx?.id] || 'Transaction rejected',
                              })}
                              loading={actionLoading === tx?.id}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {tx?.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            onClick={() => updateTransaction(tx?.id ?? '', {
                              status: 'CREDITED',
                              amountFiat: fiatInputs?.[tx?.id] ?? tx?.amountFiat ?? undefined,
                              adminNote: noteInputs?.[tx?.id] || 'Fiat payment sent',
                            })}
                            loading={actionLoading === tx?.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Banknote className="h-3.5 w-3.5 mr-1" /> Mark Credited
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show admin note if exists */}
                  {tx?.adminNote && (
                    <div className="p-2 rounded-md bg-muted text-xs text-muted-foreground flex items-start gap-1.5">
                      <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Admin note:</span> {tx.adminNote}</span>
                    </div>
                  )}

                  {tx?.amountFiat != null && (
                    <div className="text-sm font-medium text-primary">
                      Fiat Amount: {tx.fiatCurrency === 'NGN' ? '₦' : '£'}{Number(tx.amountFiat).toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
