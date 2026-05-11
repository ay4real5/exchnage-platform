'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeftRight, CheckCircle2, Zap, Star, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'sonner';

const BG = 'linear-gradient(160deg, #06060f 0%, #0a0a1a 50%, #070710 100%)';
const BORDER = '1px solid rgba(255,255,255,0.07)';
const CARD = 'rgba(255,255,255,0.03)';

const perks = [
  'Instant settlement under 5 minutes',
  'Bank-grade security & encryption',
  'Zero hidden fees, ever',
  'Real-time competitive rates',
];

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
      toast.error('Please fill in all fields');
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setError('Passwords do not match');
      return;
    }
    if ((password?.length ?? 0) < 6) {
      toast.error('Password must be at least 6 characters');
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Submitting signup...', { name, email });
      
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      console.log('Signup response status:', res.status);
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Server returned invalid response');
      }
      
      console.log('Signup response data:', data);
      
      if (!res.ok) {
        const errorMsg = data?.error ?? `Signup failed (${res.status})`;
        toast.error(errorMsg);
        setError(errorMsg);
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
        toast.error('Auto-login failed. Please sign in manually.');
        setError('Auto-login failed. Please sign in manually.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMsg = error?.message ?? 'Network error. Please check your connection.';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] px-16 py-20 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 mb-16">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                <ArrowLeftRight className="h-4 w-4 text-white" />
              </div>
              <span className="text-[15px] font-bold text-white tracking-tight">CryptoXchange</span>
            </div>
          </Link>

          {/* Headline */}
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Free forever · No credit card
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mt-6 mb-4">
            Join <span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>50,000+</span> traders<br />cashing out crypto.
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed mb-10 max-w-sm">
            Create your account in seconds and start converting Bitcoin and USDT to Naira or Pounds — straight to your bank.
          </p>

          {/* Perks */}
          <ul className="space-y-3 mb-12">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial card */}
        <div className="relative z-10 p-5 rounded-2xl" style={{ background: CARD, border: BORDER }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>O</div>
            <div>
              <p className="text-sm font-semibold text-white">Oluwaseun A.</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-500">Crypto Trader</span>
                <span className="text-xs text-zinc-700">·</span>
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-400 italic">&ldquo;Got my Naira in under 3 minutes. Fastest service I&apos;ve used.&rdquo;</p>
        </div>
      </div>

      {/* ── RIGHT PANEL — FORM ── */}
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
            {/* Header */}
            <div className="mb-8">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create your account</h2>
              <p className="text-zinc-500 text-sm mt-1">Start cashing out crypto in minutes</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3 rounded-xl text-sm text-rose-400" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e: any) => setName(e?.target?.value ?? '')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: BORDER }}
                    onFocus={e => (e.target.style.border = '1px solid rgba(99,102,241,0.5)')}
                    onBlur={e => (e.target.style.border = BORDER)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e: any) => setEmail(e?.target?.value ?? '')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: BORDER }}
                    onFocus={e => (e.target.style.border = '1px solid rgba(99,102,241,0.5)')}
                    onBlur={e => (e.target.style.border = BORDER)}
                  />
                </div>
              </div>

              {/* Password row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e: any) => setPassword(e?.target?.value ?? '')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: BORDER }}
                      onFocus={e => (e.target.style.border = '1px solid rgba(99,102,241,0.5)')}
                      onBlur={e => (e.target.style.border = BORDER)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Confirm</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e: any) => setConfirmPassword(e?.target?.value ?? '')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: BORDER }}
                      onFocus={e => (e.target.style.border = '1px solid rgba(99,102,241,0.5)')}
                      onBlur={e => (e.target.style.border = BORDER)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}
              >
                {loading ? (
                  <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating account...</>
                ) : (
                  <>Create account <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            {/* Footer links */}
            <p className="text-center text-sm text-zinc-600 mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</Link>
            </p>
            <p className="text-center text-xs text-zinc-700 mt-2">
              By continuing you agree to our{' '}
              <Link href="#" className="hover:text-zinc-500 transition-colors">Terms</Link>
              {' & '}
              <Link href="#" className="hover:text-zinc-500 transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
