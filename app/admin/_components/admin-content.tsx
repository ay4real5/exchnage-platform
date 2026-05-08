'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AdminStats } from './admin-stats';
import { WalletManager } from './wallet-manager';
import { TransactionManager } from './transaction-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Wallet, FileStack, Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function AdminContent() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const isAdmin = (session?.user as any)?.isAdmin;

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

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-16">
        <Card>
          <CardContent className="py-12 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You do not have admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage wallets, verify transactions, and track operations</p>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview" className="gap-1.5">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="wallets" className="gap-1.5">
              <Wallet className="h-4 w-4" /> Wallets
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-1.5">
              <FileStack className="h-4 w-4" /> Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminStats />
          </TabsContent>
          <TabsContent value="wallets">
            <WalletManager />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionManager />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
