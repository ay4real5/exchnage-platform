'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AdminStats } from './admin-stats';
import { WalletManager } from './wallet-manager';
import { TransactionManager } from './transaction-manager';
import { NotificationBell } from './notification-bell';
import { BarChart3, Wallet, FileStack, Loader2, ShieldAlert, LayoutDashboard, LogOut, Shield, ChevronDown, User } from 'lucide-react';

export function AdminContent() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const isAdmin = (session?.user as any)?.isAdmin;
  const [tab, setTab] = useState('overview');
  const [profileOpen, setProfileOpen] = useState(false);

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

  const userName = session?.user?.name ?? session?.user?.email ?? 'Admin';
  const userEmail = session?.user?.email ?? '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d0d14 0%, #0f0f1a 50%, #0a0d18 100%)' }}>
      {/* Top Nav Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] backdrop-blur-xl" style={{ background: 'rgba(10,10,20,0.85)' }}>
        <div className="mx-auto max-w-[1280px] px-6 h-14 flex items-center justify-between gap-4">

          {/* Left — Brand */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-tight">CryptoXchange</span>
              <span className="text-zinc-600">/</span>
              <span className="text-sm font-medium text-indigo-400">Admin</span>
            </div>
          </div>

          {/* Right — actions + profile */}
          <div className="flex items-center gap-2">
            <NotificationBell />

            {/* Dashboard shortcut */}
            <Link href="/dashboard">
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </button>
            </Link>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all"
              >
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow">
                  {userInitial}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-none">{userName}</p>
                  <p className="text-[10px] text-indigo-400 font-medium mt-0.5">Admin</p>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-[#0f0f1a] shadow-2xl shadow-black/50 z-50 overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white">
                          {userInitial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{userName}</p>
                          <p className="text-[11px] text-zinc-500 truncate">{userEmail}</p>
                        </div>
                      </div>
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                        <Shield className="h-2.5 w-2.5" /> Admin
                      </span>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}>
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-left">
                          <LayoutDashboard className="h-4 w-4" />
                          User Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={() => { setProfileOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left mt-0.5"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mx-auto max-w-[1280px] px-6 pb-0">
          <div className="flex gap-0 border-b border-white/[0.06]">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors ${
                    tab === t.id
                      ? 'text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                  {tab === t.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-[1280px] px-6 py-8">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {tab === 'overview' && <AdminStats />}
          {tab === 'wallets' && <WalletManager />}
          {tab === 'transactions' && <TransactionManager />}
        </motion.div>
      </main>
    </div>
  );
}
