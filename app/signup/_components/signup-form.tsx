'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowLeftRight, CheckCircle2, Star, ArrowRight, Shield, Zap, Banknote, Check, KeyRound, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const BG = 'linear-gradient(160deg, #06060f 0%, #0a0a1a 50%, #070710 100%)';
const BORDER = '1px solid rgba(255,255,255,0.07)';
const CARD = 'rgba(255,255,255,0.03)';
const INPUT_STYLE = { background: 'rgba(255,255,255,0.04)', border: BORDER };
const INPUT_FOCUS = '1px solid rgba(99,102,241,0.5)';

const STEPS = [
  { id: 1, label: 'Your info', icon: User },
  { id: 2, label: 'Security', icon: Shield },
  { id: 3, label: 'Verify', icon: KeyRound },
  { id: 4, label: 'You\'re in', icon: Zap },
];

const HOW_IT_WORKS = [
  { icon: Shield, title: 'Create account', desc: 'Free in 60 seconds', color: '#6366f1' },
  { icon: ArrowLeftRight, title: 'Submit trade', desc: 'Paste tx hash + bank', color: '#8b5cf6' },
  { icon: Banknote, title: 'Receive cash', desc: 'NGN or GBP, fast', color: '#10b981' },
];

function DarkInput({ icon: Icon, ...props }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
        style={{ ...INPUT_STYLE, border: focused ? INPUT_FOCUS : BORDER }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export function SignupForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState(1);

  const goNext = () => { setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const el = document.getElementById(`otp-${idx + 1}`);
      el?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const el = document.getElementById(`otp-${idx - 1}`);
      el?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      document.getElementById('otp-5')?.focus();
      e.preventDefault();
    }
  };

  const validateStep1 = () => {
    if (!name.trim()) { setError('Please enter your name'); return false; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email'); return false; }
    return true;
  };
  const validateStep2 = () => {
    if (password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return false; }
    return true;
  };

  const handleStep1 = () => { setError(''); if (validateStep1()) goNext(); };

  const handleSubmit = async () => {
    setError('');
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error('Server returned invalid response'); }
      if (!res.ok) {
        const msg = data?.error ?? `Signup failed (${res.status})`;
        setError(msg); toast.error(msg); return;
      }
      toast.success('Check your email for a 6-digit code');
      setOtp(['', '', '', '', '', '']);
      setDirection(1); setStep(3);
    } catch (err: any) {
      const msg = err?.message ?? 'Network error';
      setError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the full 6-digit code'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      let data;
      try { data = await res.json(); } catch { throw new Error('Server returned invalid response'); }
      if (!res.ok) {
        const msg = data?.error ?? 'Verification failed';
        setError(msg); toast.error(msg); return;
      }
      toast.success('Email verified!');
      setDirection(1); setStep(4);
      setTimeout(() => {
        signIn('credentials', { email, password, redirect: true, callbackUrl: '/dashboard' });
      }, 2000);
    } catch (err: any) {
      const msg = err?.message ?? 'Network error';
      setError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) { toast.success('New code sent!'); setOtp(['', '', '', '', '', '']); }
      else { toast.error('Failed to resend — please try again'); }
    } catch { toast.error('Network error'); }
    finally { setResendLoading(false); }
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] px-16 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <Link href="/">
            <div className="flex items-center gap-2.5 mb-14">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                <ArrowLeftRight className="h-4 w-4 text-white" />
              </div>
              <span className="text-[15px] font-bold text-white tracking-tight">CryptoXchange</span>
            </div>
          </Link>

          {/* Dynamic step context */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300 mb-6" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Free forever · No credit card
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                  Join <span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>50,000+</span> traders<br />cashing out crypto.
                </h1>
                <p className="text-zinc-400 text-base leading-relaxed max-w-sm">Convert Bitcoin and USDT to Naira or Pounds — straight to your bank in minutes.</p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-violet-300 mb-6" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
                  <Shield className="h-3 w-3" /> Bank-grade encryption
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight mb-4">Almost there,<br /><span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{name.split(' ')[0] || 'friend'}.</span></h1>
                <p className="text-zinc-400 text-base leading-relaxed max-w-sm">Your password is hashed and never stored in plaintext. Your funds are always under your control.</p>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300 mb-6" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <KeyRound className="h-3 w-3" /> Code sent to your inbox
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight mb-4">One last step,<br /><span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{name.split(' ')[0] || 'friend'}.</span></h1>
                <p className="text-zinc-400 text-base leading-relaxed max-w-sm">Enter the 6-digit code we just emailed to <span className="text-white font-medium">{email}</span> to activate your account.</p>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300 mb-6" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Account active
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight mb-4">You&apos;re all set,<br /><span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{name.split(' ')[0] || 'trader'}.</span></h1>
                <p className="text-zinc-400 text-base leading-relaxed max-w-sm">Signing you in now. Your dashboard is ready — start your first trade.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works */}
          <div className="mt-12 space-y-4">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${h.color}18`, border: `1px solid ${h.color}30` }}>
                  <h.icon className="h-4 w-4" style={{ color: h.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{h.title}</p>
                  <p className="text-xs text-zinc-600">{h.desc}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="ml-auto h-px w-4 bg-zinc-800" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 p-5 rounded-2xl" style={{ background: CARD, border: BORDER }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>O</div>
            <div>
              <p className="text-sm font-semibold text-white">Oluwaseun A.</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-500">Crypto Trader</span>
                <span className="mx-1 text-zinc-700">·</span>
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-400 italic">&ldquo;Got my Naira in under 3 minutes. Fastest service I&apos;ve used.&rdquo;</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
              <ArrowLeftRight className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-white">CryptoXchange</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {STEPS.map((s, i) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={{
                        background: done ? 'linear-gradient(135deg,#10b981,#059669)' : active ? 'linear-gradient(135deg,#6366f1,#7c3aed)' : 'rgba(255,255,255,0.05)',
                        border: done || active ? 'none' : BORDER,
                        color: done || active ? 'white' : '#52525b',
                        boxShadow: active ? '0 0 16px rgba(99,102,241,0.4)' : 'none',
                      }}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block transition-colors ${active ? 'text-white' : done ? 'text-emerald-500' : 'text-zinc-700'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px mx-2 transition-all duration-500" style={{ background: done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card */}
          <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(14,14,28,0.9)', border: BORDER, boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            <AnimatePresence mode="wait" custom={direction}>
              {/* ── STEP 1 ── */}
              {step === 1 && (
                <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="p-8">
                  <div className="mb-7">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 20px rgba(99,102,241,0.35)' }}>
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Who are you?</h2>
                    <p className="text-zinc-500 text-sm mt-1">Let&apos;s start with the basics</p>
                  </div>

                  {error && <div className="mb-5 p-3 rounded-xl text-sm text-rose-400" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>{error}</div>}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
                      <DarkInput icon={User} type="text" placeholder="Jane Doe" value={name} onChange={(e: any) => setName(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Email address</label>
                      <DarkInput icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <button onClick={handleStep1} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white mt-6 transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 28px rgba(99,102,241,0.35)' }}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="text-center text-sm text-zinc-600 mt-5">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</Link>
                  </p>
                </motion.div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="p-8">
                  <div className="mb-7">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 8px 20px rgba(124,58,237,0.35)' }}>
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Secure your account</h2>
                    <p className="text-zinc-500 text-sm mt-1">Choose a strong password</p>
                  </div>

                  {error && <div className="mb-5 p-3 rounded-xl text-sm text-rose-400" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>{error}</div>}

                  {/* Strength indicator */}
                  <div className="mb-4">
                    <div className="flex gap-1.5 mb-1">
                      {[1, 2, 3, 4].map(i => {
                        const strength = password.length >= i * 3 ? (i <= 2 ? '#f59e0b' : '#10b981') : 'rgba(255,255,255,0.06)';
                        return <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: strength }} />;
                      })}
                    </div>
                    <p className="text-[11px] text-zinc-600">
                      {password.length === 0 ? 'Enter a password' : password.length < 6 ? 'Too short' : password.length < 10 ? 'Good' : 'Strong'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
                      <DarkInput icon={Lock} type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Confirm password</label>
                      <DarkInput icon={Lock} type="password" placeholder="••••••••" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} />
                      {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-rose-400 mt-1">Passwords don&apos;t match</p>
                      )}
                      {confirmPassword && password === confirmPassword && password.length >= 6 && (
                        <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Passwords match</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={goBack} className="px-5 py-3.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: BORDER }}>
                      Back
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 28px rgba(99,102,241,0.35)' }}>
                      {loading ? (
                        <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating...</>
                      ) : (
                        <>Create account <ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-xs text-zinc-700 mt-4">
                    By continuing you agree to our{' '}
                    <Link href="#" className="hover:text-zinc-500 transition-colors">Terms</Link>
                    {' & '}
                    <Link href="#" className="hover:text-zinc-500 transition-colors">Privacy Policy</Link>
                  </p>
                </motion.div>
              )}

              {/* ── STEP 3 — OTP ── */}
              {step === 3 && (
                <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="p-8">
                  <div className="mb-7">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 20px rgba(99,102,241,0.35)' }}>
                      <KeyRound className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Check your email</h2>
                    <p className="text-zinc-500 text-sm mt-1">We sent a 6-digit code to <span className="text-zinc-300">{email}</span></p>
                  </div>

                  {error && <div className="mb-5 p-3 rounded-xl text-sm text-rose-400" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>{error}</div>}

                  <div className="flex gap-2 justify-between mb-6" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        className="w-full aspect-square text-center text-xl font-bold text-white rounded-xl outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: digit ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: digit ? '0 0 12px rgba(99,102,241,0.2)' : 'none',
                        }}
                      />
                    ))}
                  </div>

                  <button onClick={handleVerifyOtp} disabled={loading || otp.join('').length !== 6} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 8px 28px rgba(99,102,241,0.35)' }}>
                    {loading ? (
                      <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Verifying…</>
                    ) : (
                      <>Verify &amp; continue <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-xs text-zinc-600">Didn&apos;t get the email?</span>
                    <button onClick={handleResendOtp} disabled={resendLoading} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors disabled:opacity-50">
                      {resendLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                      Resend code
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4 — SUCCESS ── */}
              {step === 4 && (
                <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="p-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}>
                    <Check className="h-10 w-10 text-white" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-2">Account verified!</h2>
                  <p className="text-zinc-400 text-sm mb-8">Signing you in automatically, {name.split(' ')[0]}…</p>

                  <div className="space-y-3 text-left mb-8">
                    {[
                      { label: 'Submit your first trade', sub: 'Paste a tx hash and bank details' },
                      { label: 'Get NGN or GBP', sub: 'Funds arrive in under 5 minutes' },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.15 }} className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: CARD, border: BORDER }}>
                        <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white mt-0.5" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>{i + 1}</div>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.label}</p>
                          <p className="text-xs text-zinc-600">{item.sub}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                    <span className="h-4 w-4 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
                    Redirecting to your dashboard…
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
