'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AdminStats } from './admin-stats';
import { WalletManager } from './wallet-manager';
import { TransactionManager } from './transaction-manager';
import { NotificationBell } from './notification-bell';
import { BarChart3, Wallet, FileStack, Loader2, ShieldAlert } from 'lucide-react';

export function AdminContent() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const isAdmin = (session?.user as any)?.isAdmin;
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!session?.user) return null;

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-[1200px] px-4 py-16">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
          <ShieldAlert className="h-12 w-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400">You do not have admin privileges to access this page.</p>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: FileStack },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Command Center</h1>
              <p className="text-[10px] text-zinc-500">Admin Dashboard</p>
            </div>
          </div>
          <NotificationBell />
        </div>

        {/* Tab bar */}
        <div className="mx-auto max-w-[1200px] px-4 pb-3">
          <div className="flex gap-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                    tab === t.id
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-[1200px] px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {tab === 'overview' && <AdminStats />}
          {tab === 'wallets' && <WalletManager />}
          {tab === 'transactions' && <TransactionManager />}
        </motion.div>
      </main>
    </div>
  );
}
