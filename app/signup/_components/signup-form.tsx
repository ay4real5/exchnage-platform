'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Lock,
  User,
  Bitcoin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if ((password?.length ?? 0) < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error('Server returned invalid response');
      }

      if (!res.ok) {
        const errorMsg = data?.error ?? `Signup failed (${res.status})`;
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success('Account created! Signing you in...');
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/dashboard',
      });

      if (signInResult?.error) {
        setError('Auto-login failed. Please sign in manually.');
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Network error. Please check your connection.';
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
        {/* LEFT — pitch panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block text-slate-900"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Free forever · No credit card
          </div>

          <h2 className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Join{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              50,000+ traders
            </span>{' '}
            cashing out crypto.
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md">
            Create your account in seconds and start converting Bitcoin and USDT to Naira or Pounds — straight to your bank.
          </p>

          <ul className="space-y-3">
            {[
              'Instant settlement under 5 minutes',
              'Bank-grade security & encryption',
              'Zero hidden fees, ever',
              'Real-time competitive rates',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-slate-700">
                <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl bg-white border border-slate-200 shadow-lg p-5 max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                O
              </div>
              <div>
                <div className="font-semibold text-sm">Oluwaseun A.</div>
                <div className="text-xs text-slate-500">Crypto Trader · 5★</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 italic">
              &quot;Got my Naira in under 3 minutes. Fastest service I&apos;ve used.&quot;
            </p>
          </div>
        </motion.div>

        {/* RIGHT — form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          {/* glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-rose-500/20 rounded-3xl blur-2xl" />

          <div className="relative rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 p-7 md:p-8">
            <div className="text-center mb-7">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-rose-500 shadow-lg shadow-indigo-500/30">
                <Bitcoin className="h-7 w-7 text-white" />
              </div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
                Create your account
              </h1>
              <p className="text-slate-500 mt-2">Start cashing out crypto in minutes</p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-700 font-medium text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e: any) => setName(e?.target?.value ?? '')}
                    className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-700 font-medium text-sm">
                    Password
                  </Label>
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

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium text-sm">
                    Confirm
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e: any) => setConfirmPassword(e?.target?.value ?? '')}
                      className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="group w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 hover:opacity-90 text-white font-semibold shadow-lg shadow-indigo-500/30 mt-2"
              >
                Create account
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                Sign in
              </Link>
            </p>

            <p className="text-center text-xs text-slate-400 mt-4">
              By continuing you agree to our Terms & Privacy Policy
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
