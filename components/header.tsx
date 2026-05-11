'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeftRight, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { data: session, status } = useSession() || {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = (session?.user as any)?.isAdmin;

  return (
    <header className="fixed top-0 z-50 w-full" style={{ background: 'rgba(8,8,16,0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
            <ArrowLeftRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">CryptoXchange</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {status === 'authenticated' && session?.user ? (
            <>
              <Link href="/dashboard">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                  <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                </button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </button>
                </Link>
              )}
              <div className="w-px h-4 bg-white/10 mx-1" />
              <span className="text-sm text-zinc-500 px-2">{session?.user?.name ?? session?.user?.email ?? 'User'}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <a href="/#rates" className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all">Rates</a>
              <a href="/#how-it-works" className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all">How it works</a>
              <a href="/#about" className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all">About</a>
              <div className="w-px h-4 bg-white/10 mx-2" />
              <Link href="/login">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                  Get Started
                </button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,16,0.95)' }}
          >
            <div className="flex flex-col gap-1 p-4">
              {status === 'authenticated' && session?.user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>
                      <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left">
                        <Shield className="h-4 w-4" /> Admin
                      </button>
                    </Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-all text-left">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/#rates" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all">Rates</a>
                  <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all">How it works</a>
                  <a href="/#about" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all">About</a>
                  <div className="h-px bg-white/5 my-1" />
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-left">Login</button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <button className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-white text-left" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>Get Started</button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
