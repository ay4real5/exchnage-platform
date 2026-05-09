'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Shield,
  Zap,
  Bitcoin,
  TrendingUp,
  Lock,
  CheckCircle2,
  Sparkles,
  Coins,
  Wallet,
  Banknote,
  Globe2,
  ChevronRight,
} from 'lucide-react';

const liveRates = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,234', change: '+2.4%', up: true, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { symbol: 'USDT', name: 'Tether', price: '$1.00', change: '+0.01%', up: true, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,421', change: '+1.8%', up: true, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

const features = [
  { icon: Zap, title: 'Instant Settlement', desc: 'Average payout under 5 minutes', color: 'from-amber-400 to-orange-500' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'End-to-end encrypted transfers', color: 'from-emerald-400 to-teal-500' },
  { icon: TrendingUp, title: 'Best Market Rates', desc: 'Real-time competitive pricing', color: 'from-rose-400 to-pink-500' },
  { icon: Lock, title: 'Non-Custodial', desc: 'You stay in control, always', color: 'from-violet-400 to-purple-500' },
];

const steps = [
  { num: '01', icon: Wallet, title: 'Send your crypto', desc: 'Transfer BTC or USDT to your unique secure address.' },
  { num: '02', icon: Coins, title: 'Confirm details', desc: 'Submit your transaction hash and bank info in seconds.' },
  { num: '03', icon: Banknote, title: 'Get paid in fiat', desc: 'Receive Naira or GBP straight to your bank account.' },
];

export function LandingContent() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative bg-white text-slate-900 overflow-hidden">
      {/* ============== HERO ============== */}
      <section className="relative">
        {/* gradient mesh background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,#dbeafe_0%,transparent_50%),radial-gradient(ellipse_at_top_right,#fce7f3_0%,transparent_50%),radial-gradient(ellipse_at_bottom,#dcfce7_0%,transparent_60%)]" />
        {/* subtle grid */}
        <div className="absolute inset-0 -z-10 opacity-[0.04] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live exchange · 50,000+ users
              </motion.div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
                Crypto
                <span className="relative inline-block mx-3">
                  <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
                    cashed out
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 200 14" fill="none">
                    <path d="M2 10 Q 50 2, 100 8 T 198 6" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <defs>
                      <linearGradient id="g" x1="0" x2="1">
                        <stop offset="0" stopColor="#4f46e5" />
                        <stop offset="0.5" stopColor="#d946ef" />
                        <stop offset="1" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                in minutes.
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-xl mb-8 leading-relaxed">
                Convert <span className="font-semibold text-slate-900">Bitcoin</span> and{' '}
                <span className="font-semibold text-slate-900">USDT</span> to <span className="font-semibold text-slate-900">Naira</span> or{' '}
                <span className="font-semibold text-slate-900">Pounds</span> — straight to your bank. No middlemen. No drama.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="group h-14 px-8 text-base font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20"
                  >
                    Start exchanging
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-base font-semibold rounded-xl border-slate-300 hover:bg-slate-50"
                  >
                    I have an account
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No KYC delays
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Zero hidden fees
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  24/7 support
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Floating exchange card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-rose-500/30 rounded-3xl blur-2xl" />

              <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-900/10 p-6 md:p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Live rates</span>
                  </div>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>

                {/* You send */}
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 mb-2">
                  <div className="text-xs font-medium text-slate-500 mb-2">You send</div>
                  <div className="flex items-center justify-between">
                    <input
                      readOnly
                      value="0.05"
                      className="bg-transparent text-3xl font-bold text-slate-900 outline-none w-32"
                    />
                    <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2">
                      <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        ₿
                      </div>
                      <span className="font-semibold text-slate-900">BTC</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">≈ $3,361.70</div>
                </div>

                {/* arrow divider */}
                <div className="flex justify-center -my-3 relative z-10">
                  <div className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-slate-700 rotate-90" />
                  </div>
                </div>

                {/* You get */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-rose-50 border border-indigo-100 p-5 mb-5">
                  <div className="text-xs font-medium text-slate-500 mb-2">You receive</div>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-slate-900">5,378,720</div>
                    <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2">
                      <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                        ₦
                      </div>
                      <span className="font-semibold text-slate-900">NGN</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Bank deposit · ~5 min</div>
                </div>

                <Link href="/signup">
                  <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 hover:opacity-90 text-white font-semibold shadow-lg">
                    Lock in this rate
                  </Button>
                </Link>

                <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-slate-100">
                  {liveRates.map((r) => (
                    <div key={r.symbol} className={`rounded-xl ${r.bg} p-3`}>
                      <div className={`text-xs font-bold ${r.color}`}>{r.symbol}</div>
                      <div className="text-sm font-semibold text-slate-900 mt-1">{r.price}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">{r.change}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-4 rounded-2xl bg-white border border-slate-200 shadow-xl px-4 py-3 flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Speed</div>
                  <div className="text-sm font-bold text-slate-900">~ 4 min</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 rounded-2xl bg-white border border-slate-200 shadow-xl px-4 py-3 flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Globe2 className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">NGN · GBP</div>
                  <div className="text-sm font-bold text-slate-900">2 currencies</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* trusted by stats */}
          <div className="mt-20 pt-10 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { v: '$2.5M+', l: 'Volume traded' },
                { v: '50K+', l: 'Active users' },
                { v: '99.9%', l: 'Uptime' },
                { v: '4.9★', l: 'Avg. rating' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    {s.v}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== MARQUEE ============== */}
      <section className="border-y border-slate-200 bg-white py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-12 px-6 text-slate-400 font-display font-semibold text-2xl">
              <span>BITCOIN</span><span>·</span>
              <span>TETHER</span><span>·</span>
              <span>NAIRA</span><span>·</span>
              <span>POUNDS</span><span>·</span>
              <span>INSTANT</span><span>·</span>
              <span>SECURE</span><span>·</span>
              <span>NON-CUSTODIAL</span><span>·</span>
              <span>BEST RATES</span><span>·</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============== FEATURES ============== */}
      <section className="py-24 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 mb-4">
              WHY US
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Built for speed.<br />Engineered for trust.
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to swap crypto into cash without the usual headache.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-xl transition-all"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600">{f.desc}</p>
                <ChevronRight className="absolute top-6 right-6 h-4 w-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        {/* glow orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-3 py-1 text-xs font-semibold mb-4">
              HOW IT WORKS
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Three steps. That&apos;s it.
            </h2>
            <p className="text-lg text-slate-300">
              From wallet to bank account in the time it takes to make coffee.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-7 hover:bg-white/10 transition-colors h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <s.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-5xl font-display font-extrabold text-white/10">{s.num}</div>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="py-24 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-rose-500 p-10 md:p-16 text-center text-white"
          >
            {/* decorative shapes */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <Bitcoin className="h-12 w-12 mx-auto mb-6 opacity-90" />
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Ready to cash out?
            </h2>
            <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
              Join 50,000+ traders moving crypto to fiat in minutes — not days.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 px-10 text-base font-semibold rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-xl"
              >
                Create your free account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <p className="text-white/70 text-sm mt-6">No credit card · No setup fees · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-slate-200 bg-white py-10 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-fuchsia-500 flex items-center justify-center">
              <Bitcoin className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-slate-900">CryptoXchange</span>
          </div>
          <p>© 2026 CryptoXchange. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-900">Privacy</Link>
            <Link href="#" className="hover:text-slate-900">Terms</Link>
            <Link href="#" className="hover:text-slate-900">Contact</Link>
          </div>
        </div>
      </footer>

      {/* marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
}
