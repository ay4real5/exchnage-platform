'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Command,
  Search,
  LogOut,
  Zap,
  ChevronDown,
  Menu,
  X,
  Wallet,
  Send,
  History,
  BarChart3,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AuroraBackground } from './aurora-background';
import { TopTicker } from './top-ticker';
import { CommandPalette } from './command-palette';
import { toast } from 'sonner';
import Link from 'next/link';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = (session?.user?.name ?? 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen text-white">
      <AuroraBackground />
      <TopTicker />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/60 backdrop-blur-2xl">
        <div className="mx-auto max-w-[1400px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-sm hidden sm:block">FinVault</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/dashboard', label: 'Overview', icon: Home },
              { href: '/dashboard?send=1', label: 'Send', icon: Send },
              { href: '/dashboard?wallets=1', label: 'Wallets', icon: Wallet },
              { href: '/dashboard/history', label: 'History', icon: History },
            ].map((item) => (
              <Link key={item.label} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-white/5 gap-1.5"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white hover:bg-white/5 gap-1.5 hidden sm:flex"
              onClick={() => setCmdOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">⌘K</span>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <Avatar className="h-7 w-7 border border-white/10">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-[10px] font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl px-4 pb-4"
          >
            {[
              { href: '/dashboard', label: 'Overview', icon: Home },
              { href: '/dashboard?send=1', label: 'Send Crypto', icon: Send },
              { href: '/dashboard?wallets=1', label: 'Wallets', icon: Wallet },
              { href: '/dashboard/history', label: 'History', icon: History },
            ].map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 py-3 text-zinc-300 hover:text-white">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-[1400px] px-4 py-6 pb-24">
        {children}
      </main>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}
