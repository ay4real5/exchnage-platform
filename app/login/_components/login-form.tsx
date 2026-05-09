'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Lock,
  Bitcoin,
  ArrowRight,
  AlertCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
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
        setError(res.error);
        toast.error(res.error);
      } else {
        toast.success('Welcome back!');
        router.replace('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-white overflow-hidden">
      {/* mesh gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,#dbeafe_0%,transparent_50%),radial-gradient(ellipse_at_top_right,#fce7f3_0%,transparent_50%),radial-gradient(ellipse_at_bottom,#dcfce7_0%,transparent_60%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.04] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT — pitch */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block text-slate-900"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Welcome back
          </div>

          <h2 className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Pick up{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              right where
            </span>
            <br />
            you left off.
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md">
            Sign in to access your dashboard, track your transactions, and manage your crypto-to-fiat exchanges.
          </p>

          {/* live rates preview */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-5 max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Live rates</span>
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="space-y-3">
              {[
                { sym: 'BTC', name: 'Bitcoin', price: '$67,234', change: '+2.4%' },
                { sym: 'USDT', name: 'Tether', price: '$1.00', change: '+0.01%' },
                { sym: 'ETH', name: 'Ethereum', price: '$3,421', change: '+1.8%' },
              ].map((c) => (
                <div key={c.sym} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                      {c.sym}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.sym}/USD</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{c.price}</div>
                    <div className="text-xs text-emerald-600 font-medium">{c.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT — form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-rose-500/20 rounded-3xl blur-2xl" />

          <div className="relative rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 p-7 md:p-8">
            <div className="text-center mb-7">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-rose-500 shadow-lg shadow-indigo-500/30">
                <Bitcoin className="h-7 w-7 text-white" />
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back
              </h1>
              <p className="text-slate-500 mt-2">Sign in to your CryptoXchange account</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e: any) => setEmail(e?.target?.value ?? '')}
                    className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                    Password
                  </Label>
                  <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: any) => setPassword(e?.target?.value ?? '')}
                    className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="group w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-indigo-500/30 mt-2"
              >
                Sign in
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
