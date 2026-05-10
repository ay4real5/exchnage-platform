'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Send,
  Wallet,
  History,
  LogOut,
  Menu,
  X,
  ArrowLeftRight,
  Shield,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/send', label: 'Send Crypto', icon: Send },
  { href: '/dashboard/wallets', label: 'Wallets', icon: Wallet },
  { href: '/dashboard/history', label: 'History', icon: History },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = (session?.user as any)?.isAdmin;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r bg-white sticky top-0 h-screen z-30">
        <div className="px-5 py-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500">
              <ArrowLeftRight className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">CryptoXchange</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                    (active
                      ? 'bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-indigo-700 shadow-sm'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900')
                  }
                >
                  <item.icon className={`h-4.5 w-4.5 ${active ? 'text-indigo-600' : 'text-zinc-400'}`} />
                  {item.label}
                  {active && <ChevronRight className="ml-auto h-4 w-4 text-indigo-400" />}
                </div>
              </Link>
            );
          })}

          {isAdmin && (
            <Link href="/admin">
              <div
                className={
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                  (pathname === '/admin'
                    ? 'bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-indigo-700 shadow-sm'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900')
                }
              >
                <Shield className={`h-4.5 w-4.5 ${pathname === '/admin' ? 'text-indigo-600' : 'text-zinc-400'}`} />
                Admin Panel
              </div>
            </Link>
          )}
        </nav>

        <div className="p-3 border-t">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-white text-xs font-bold">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name ?? 'User'}</p>
              <p className="text-xs text-zinc-400 truncate">{session?.user?.email ?? ''}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full mt-1 justify-start text-zinc-500 hover:text-red-600"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b">
          <div className="flex items-center justify-between px-4 h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500">
                <ArrowLeftRight className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold">CryptoXchange</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                <Activity className="h-3 w-3" />
                Live
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t bg-white"
              >
                <div className="p-3 space-y-1">
                  {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                        <div
                          className={
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ' +
                            (active
                              ? 'bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-indigo-700'
                              : 'text-zinc-500')
                          }
                        >
                          <item.icon className={`h-4.5 w-4.5 ${active ? 'text-indigo-600' : 'text-zinc-400'}`} />
                          {item.label}
                        </div>
                      </Link>
                    );
                  })}
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500">
                        <Shield className="h-4.5 w-4.5 text-zinc-400" /> Admin Panel
                      </div>
                    </Link>
                  )}
                  <div className="pt-2 border-t mt-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-zinc-500"
                      size="sm"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sign out
                    </Button>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* Top bar for desktop */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="font-medium text-zinc-900">Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span>
              {navItems.find((n) => n.href === pathname)?.label ?? 'Overview'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Markets Open
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
