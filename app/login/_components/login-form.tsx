'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeftRight, ArrowRight, TrendingUp, Users, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const BG = 'linear-gradient(160deg, #06060f 0%, #0a0a1a 50%, #070710 100%)';
const BORDER = '1px solid rgba(255,255,255,0.07)';

const STATS = [
  { icon: TrendingUp, label: '$2.5M+', sub: 'Volume today', color: '#6366f1' },
  { icon: Users, label: '50K+', sub: 'Active traders', color: '#8b5cf6' },
  { icon: Clock, label: '<5 min', sub: 'Avg. payout', color: '#10b981' },
  { icon: ShieldCheck, label: '99.9%', sub: 'Uptime', color: '#f59e0b' },
];

const RATES = [
  { symbol: 'BTC', rate: '₦ 98,432,000', change: '+2.4%', up: true },
  { symbol: 'USDT', rate: '₦ 1,612', change: '+0.1%', up: true },
  { symbol: 'ETH', rate: '₦ 5,241,000', change: '-0.8%', up: false },
];

function DarkInput({ icon: Icon, ...props }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
        style={{ background: 'rgba(255,255,255,0.04)', border: focused ? '1px solid rgba(99,102,241,0.5)' : BORDER }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Logged in successfully!');
        router.replace('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] px-16 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(99,102,241,0.11) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <Link href="/">
            <div className="flex items-center gap-2.5 mb-14">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                <ArrowLeftRight className="h-4 w-4 text-white" />
              </div>
              <span className="text-[15px] font-bold text-white tracking-tight">CryptoXchange</span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300 mb-6" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Markets live now
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Welcome<br />back, <span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>trader.</span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-sm">Your trades, your rates, your bank account. Log in and cash out in minutes.</p>

          {/* Live rate ticker */}
          <div className="space-y-2.5 mb-10">
            {RATES.map((r) => (
              <div key={r.symbol} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: BORDER }}>
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>{r.symbol[0]}</div>
                  <span className="text-sm font-semibold text-white">{r.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{r.rate}</p>
                  <p className={`text-xs font-medium ${r.up ? 'text-emerald-400' : 'text-rose-400'}`}>{r.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: BORDER }}>
                <p className="text-base font-bold text-white">{s.label}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-700">© 2025 CryptoXchange. All rights reserved.</div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
              <ArrowLeftRight className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-white">CryptoXchange</span>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-8" style={{ background: 'rgba(14,14,28,0.9)', border: BORDER, boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            <div className="mb-8">
              <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
                <ArrowLeftRight className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Sign in</h2>
              <p className="text-zinc-500 text-sm mt-1">Access your CryptoXchange account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Email address</label>
                <DarkInput icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={(e: any) => setEmail(e?.target?.value ?? '')} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Password</label>
                </div>
                <DarkInput icon={Lock} type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e?.target?.value ?? '')} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white mt-2 transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 28px rgba(99,102,241,0.35)' }}
              >
                {loading ? (
                  <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in…</>
                ) : (
                  <>Sign in <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-600 mt-5">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Get started free</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
