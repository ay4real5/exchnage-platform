'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Bitcoin, 
  Banknote, 
  ArrowLeftRight,
  TrendingUp,
  Lock,
  Smartphone,
  CheckCircle2,
  Star,
  ArrowDown,
  Wallet,
  BadgeCheck,
  RefreshCw,
  Users,
  Clock,
  HeartHandshake
} from 'lucide-react';

const BG = 'linear-gradient(160deg, #06060f 0%, #0a0a1a 50%, #070710 100%)';
const CARD_BG = 'rgba(255,255,255,0.03)';
const BORDER = '1px solid rgba(255,255,255,0.07)';

const rateRows = [
  { from: 'BTC', fromName: 'Bitcoin', to: 'NGN', toName: 'Naira', rate: '₦ 98,432,000', per: 'per BTC', spread: '0%', time: '~4 min', color: '#f7931a' },
  { from: 'USDT', fromName: 'Tether', to: 'NGN', toName: 'Naira', rate: '₦ 1,612', per: 'per USDT', spread: '0%', time: '~3 min', color: '#26a17b' },
  { from: 'ETH', fromName: 'Ethereum', to: 'NGN', toName: 'Naira', rate: '₦ 5,241,000', per: 'per ETH', spread: '0%', time: '~5 min', color: '#627eea' },
  { from: 'BTC', fromName: 'Bitcoin', to: 'GBP', toName: 'Pounds', rate: '£ 75,820', per: 'per BTC', spread: '0%', time: '~6 min', color: '#f7931a' },
  { from: 'USDT', fromName: 'Tether', to: 'GBP', toName: 'Pounds', rate: '£ 0.79', per: 'per USDT', spread: '0%', time: '~4 min', color: '#26a17b' },
];

const trustPoints = [
  { icon: Shield, title: 'Non-custodial by design', desc: 'We never touch your crypto. You send directly on-chain; we verify and pay out. Your keys stay yours.', color: '#6366f1' },
  { icon: RefreshCw, title: 'No spread, ever', desc: 'The rate you see is the rate you get. We earn a flat service fee — no hidden markups baked into the price.', color: '#10b981' },
  { icon: Clock, title: 'Under 5 minutes, or we tell you why', desc: 'Payouts complete in minutes. If there is a delay we proactively notify you — no chasing support.', color: '#f59e0b' },
  { icon: HeartHandshake, title: 'Built by traders, for traders', desc: 'The team behind CryptoXchange has traded crypto since 2017. We built the tool we wished existed.', color: '#8b5cf6' },
];

const stats = [
  { value: '$2.5M+', label: 'Volume Traded' },
  { value: '50K+', label: 'Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 5 min', label: 'Avg. Payout' },
];

const features = [
  { icon: Shield, title: 'Bank-Grade Security', description: 'Military-grade encryption and multi-layer protocols protect every transaction end-to-end.', accent: '#6366f1' },
  { icon: Zap, title: 'Lightning Fast', description: 'Average payout under 5 minutes. Funds hit your account while others are still waiting.', accent: '#f59e0b' },
  { icon: Globe, title: 'NGN & GBP Payouts', description: 'Receive Naira or Pounds directly into any local bank account — no conversion, no delays.', accent: '#10b981' },
  { icon: Lock, title: 'Non-Custodial', description: 'We never hold your crypto. Direct wallet-to-bank with full on-chain transparency.', accent: '#8b5cf6' },
  { icon: Smartphone, title: 'Mobile First', description: 'Designed to work flawlessly on every screen. Trade anywhere, any time.', accent: '#06b6d4' },
  { icon: TrendingUp, title: 'Live Rates', description: 'Real-time exchange rates. No spreads, no hidden fees — the price you see is the price you get.', accent: '#f43f5e' },
];

const steps = [
  { icon: Wallet, title: 'Create Account', desc: 'Sign up in under 60 seconds. No KYC delays, no paperwork.', step: '01' },
  { icon: ArrowLeftRight, title: 'Submit Transaction', desc: 'Send BTC, ETH or USDT and paste your transaction hash with bank details.', step: '02' },
  { icon: Banknote, title: 'Receive Cash', desc: 'Funds land in your bank account — NGN or GBP — within minutes.', step: '03' },
];

const testimonials = [
  { name: 'Oluwaseun A.', role: 'Crypto Trader', content: 'Fastest crypto-to-fiat service I have used. Got my Naira in under 3 minutes.', rating: 5 },
  { name: 'Sarah M.', role: 'Freelancer', content: 'Reliable and transparent. The rates are competitive and no hidden charges.', rating: 5 },
  { name: 'James K.', role: 'Business Owner', content: 'I use this weekly for my business. Never had an issue in 6 months of trading.', rating: 5 },
];

const coins = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$97,234', change: '+2.4%', up: true, color: '#f7931a' },
  { symbol: 'USDT', name: 'Tether', price: '$1.00', change: '+0.0%', up: true, color: '#26a17b' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,421', change: '+1.8%', up: true, color: '#627eea' },
];

export function LandingContent() {
  return (
    <main style={{ background: BG }} className="relative overflow-hidden text-white">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 px-6">
        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 30%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} className="absolute inset-0" />
          <div style={{ background: 'radial-gradient(ellipse 50% 40% at 20% 70%, rgba(124,58,237,0.08) 0%, transparent 70%)' }} className="absolute inset-0" />
        </div>

        <div className="relative mx-auto max-w-[1200px] w-full grid md:grid-cols-2 gap-16 items-center py-24">
          {/* Left copy */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-semibold text-indigo-300" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live exchange · 50,000+ users
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              Crypto<br />
              <span style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>cashed out</span>
              <br />in minutes.
            </h1>

            <p className="text-lg text-zinc-400 max-w-md mb-10 leading-relaxed">
              Convert <span className="text-white font-medium">Bitcoin</span> and <span className="text-white font-medium">USDT</span> to Naira or Pounds — straight to your bank. No middlemen. No drama.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/signup">
                <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}>
                  Start exchanging <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/login">
                <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: BORDER }}>
                  Sign in
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-zinc-500">
              {['No KYC delays', 'Zero hidden fees', '24/7 support'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — rate widget mockup */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
            {/* Speed badge */}
            <div className="absolute -top-4 -right-2 z-10 px-3 py-2 rounded-xl text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              <Zap className="h-3 w-3 inline mr-1" />Speed ~4 min
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(14,14,28,0.9)', border: BORDER, boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
              {/* Widget header */}
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: BORDER }}>
                <span className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">Live Rates</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Send row */}
              <div className="px-5 pt-5 pb-3">
                <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-2">You send</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">0.05</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(247,147,26,0.12)', border: '1px solid rgba(247,147,26,0.2)' }}>
                    <span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: '#f7931a' }}>₿</span>
                    <span className="text-sm font-semibold text-white">BTC</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 mt-1">≈ $4,861.70</p>
              </div>

              {/* Arrow divider */}
              <div className="flex justify-center py-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <ArrowDown className="h-4 w-4 text-indigo-400" />
                </div>
              </div>

              {/* Receive row */}
              <div className="px-5 pb-4">
                <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-2">You receive</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">7,843,200</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#10b981' }}>₦</span>
                    <span className="text-sm font-semibold text-white">NGN</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 mt-1">Bank deposit · ~5 min</p>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <Link href="/signup">
                  <button className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                    Lock in this rate →
                  </button>
                </Link>
              </div>

              {/* Coin tickers */}
              <div className="grid grid-cols-3 gap-px" style={{ borderTop: BORDER, background: 'rgba(255,255,255,0.04)' }}>
                {coins.map(c => (
                  <div key={c.symbol} className="px-4 py-3" style={{ background: 'rgba(10,10,20,0.8)' }}>
                    <p className="text-[11px] font-bold text-zinc-300">{c.symbol}</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{c.price}</p>
                    <p className={`text-[10px] font-medium mt-0.5 ${c.up ? 'text-emerald-400' : 'text-rose-400'}`}>{c.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ borderTop: BORDER, borderBottom: BORDER, background: 'rgba(255,255,255,0.02)' }}>
        <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="py-8 px-6 text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── RATES ── */}
      <section id="rates" className="py-28 px-6">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Transparent pricing</p>
            <h2 className="text-4xl font-bold text-white">Today&apos;s rates</h2>
            <p className="text-zinc-500 text-base mt-3 max-w-lg">Refreshed every 60 seconds. Zero spread. The number you see lands in your account.</p>
          </motion.div>

          <div className="rounded-2xl overflow-hidden" style={{ border: BORDER }}>
            {/* Table header */}
            <div className="grid grid-cols-5 px-6 py-3 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: BORDER }}>
              <span>You send</span>
              <span>You receive</span>
              <span className="text-right">Rate</span>
              <span className="text-center">Spread</span>
              <span className="text-right">Est. time</span>
            </div>
            {rateRows.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="grid grid-cols-5 px-6 py-4 items-center hover:bg-white/[0.025] transition-colors"
                style={{ borderBottom: i < rateRows.length - 1 ? BORDER : 'none', background: CARD_BG }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ background: r.color }}>{r.from[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.from}</p>
                    <p className="text-[11px] text-zinc-600">{r.fromName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700" />
                  <div>
                    <p className="text-sm font-semibold text-white">{r.to}</p>
                    <p className="text-[11px] text-zinc-600">{r.toName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{r.rate}</p>
                  <p className="text-[11px] text-zinc-600">{r.per}</p>
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-400" style={{ background: 'rgba(16,185,129,0.1)' }}>{r.spread}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-zinc-400">{r.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-zinc-700 mt-4 flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3" /> Rates update every 60 seconds · A flat processing fee applies at checkout
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Process</p>
            <h2 className="text-4xl font-bold text-white">Three steps to cash</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="relative p-7 rounded-2xl h-full" style={{ background: CARD_BG, border: BORDER }}>
                  <span className="absolute top-5 right-6 text-5xl font-black text-white/[0.04] select-none">{step.step}</span>
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                    <step.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-28 px-6" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Why us</p>
            <h2 className="text-4xl font-bold text-white max-w-sm">Built for speed,<br />secured by design</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="p-6 rounded-2xl h-full group hover:bg-white/[0.04] transition-colors" style={{ background: CARD_BG, border: BORDER }}>
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-5" style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}30` }}>
                    <f.icon className="h-5 w-5" style={{ color: f.accent }} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / TRUST ── */}
      <section id="about" className="py-28 px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">About</p>
              <h2 className="text-4xl font-bold text-white leading-tight mb-5">
                We move money at the speed<br />
                <span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>of the blockchain.</span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-6 max-w-md">
                CryptoXchange started with one frustration: converting crypto to local currency took too long, cost too much, and involved too many middlemen. We fixed that.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                Today we process millions in volume monthly, serving traders and freelancers across Nigeria and the UK. Our infrastructure is purpose-built for speed — not repurposed from a generic payment rail.
              </p>
              <div className="flex flex-wrap gap-6 mt-10">
                {[
                  { value: '$2.5M+', label: 'Monthly volume' },
                  { value: '50K+', label: 'Traders served' },
                  { value: '2021', label: 'Founded' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-zinc-600 mt-0.5 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right trust grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trustPoints.map((tp, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="p-5 rounded-2xl h-full" style={{ background: CARD_BG, border: BORDER }}>
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center mb-4" style={{ background: `${tp.color}18`, border: `1px solid ${tp.color}28` }}>
                      <tp.icon className="h-4 w-4" style={{ color: tp.color }} />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">{tp.title}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">{tp.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="text-4xl font-bold text-white">Trusted by traders</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="p-6 rounded-2xl h-full flex flex-col" style={{ background: CARD_BG, border: BORDER }}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1 mb-5">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-zinc-600">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative rounded-3xl overflow-hidden px-8 md:px-16 py-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(124,58,237,0.12) 100%)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(99,102,241,0.15), transparent)' }} />
              <div className="relative z-10">
                <BadgeCheck className="h-10 w-10 text-indigo-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
                <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">Create a free account in seconds. No KYC. No delays. Just fast, reliable crypto payouts.</p>
                <Link href="/signup">
                  <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
                    Create free account <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <div className="flex justify-center flex-wrap gap-6 mt-6 text-sm text-zinc-600">
                  {['No hidden fees', 'Instant verification', '24/7 support'].map(t => (
                    <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-14" style={{ borderTop: BORDER }}>
        <div className="mx-auto max-w-[1200px]">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                  <ArrowLeftRight className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold text-white">CryptoXchange</span>
              </div>
              <p className="text-sm text-zinc-600 max-w-xs leading-relaxed">The fastest and most reliable way to convert cryptocurrency to fiat — directly to your bank.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-zinc-600">
                <li><Link href="/signup" className="hover:text-zinc-300 transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-zinc-300 transition-colors">Sign In</Link></li>
                <li><Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2.5 text-sm text-zinc-600">
                <li><Link href="#" className="hover:text-zinc-300 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-zinc-300 transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-zinc-300 transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-700" style={{ borderTop: BORDER }}>
            <p>&copy; 2026 CryptoXchange. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-zinc-400 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-zinc-400 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
