'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WalletDisplay } from './wallet-display';
import { TransactionForm } from './transaction-form';
import { TransactionHistory } from './transaction-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Send, History, Loader2 } from 'lucide-react';

export function DashboardContent() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  const handleTransactionSubmitted = () => {
    setRefreshKey((prev: number) => prev + 1);
  };

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl font-bold tracking-tight mb-1">
          Welcome, {session?.user?.name ?? 'there'}
        </h1>
        <p className="text-muted-foreground mb-8">Submit crypto payments and track your transactions</p>

        <Tabs defaultValue="wallets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="wallets" className="gap-1.5">
              <Wallet className="h-4 w-4" /> Wallets
            </TabsTrigger>
            <TabsTrigger value="submit" className="gap-1.5">
              <Send className="h-4 w-4" /> Submit
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5">
              <History className="h-4 w-4" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallets">
            <WalletDisplay />
          </TabsContent>
          <TabsContent value="submit">
            <TransactionForm onSuccess={handleTransactionSubmitted} />
          </TabsContent>
          <TabsContent value="history">
            <TransactionHistory key={refreshKey} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
