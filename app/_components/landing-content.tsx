'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, Globe, Bitcoin, Banknote, ArrowLeftRight } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Every transaction is verified on the blockchain before processing your fiat payment.',
  },
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Receive your fiat currency quickly once your crypto transaction is confirmed.',
  },
  {
    icon: Globe,
    title: 'Multiple Currencies',
    description: 'Convert to Nigerian Naira (NGN) or British Pounds (GBP) with competitive rates.',
  },
];

const steps = [
  { icon: Bitcoin, title: 'Send Crypto', desc: 'Send BTC or USDT to our wallet address displayed on your dashboard.' },
  { icon: ArrowLeftRight, title: 'Submit Details', desc: 'Enter your transaction hash and bank account details.' },
  { icon: Banknote, title: 'Receive Fiat', desc: 'Once verified, we credit your bank account in NGN or GBP.' },
];

export function LandingContent() {
  return (
    <main className="mx-auto max-w-[1200px] px-4">
      {/* Hero */}
      <section className="py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
            <Zap className="h-4 w-4" /> Crypto to Fiat, Simplified
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Convert <span className="text-primary">Crypto</span> to Fiat<br />Securely & Quickly
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Send your Bitcoin or USDT and receive Naira or GBP directly to your bank account.
            Simple, transparent, and reliable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Trading <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight mb-3">How It Works</h2>
          <p className="text-muted-foreground">Three simple steps to convert your crypto</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {(steps ?? []).map((step: any, i: number) => {
            const Icon = step?.icon ?? Bitcoin;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Card variant="interactive" className="text-center p-6 h-full">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">STEP {i + 1}</div>
                    <h3 className="font-display text-lg font-semibold mb-2">{step?.title ?? ''}</h3>
                    <p className="text-sm text-muted-foreground">{step?.desc ?? ''}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight mb-3">Why Choose Us</h2>
          <p className="text-muted-foreground">Built with security and speed in mind</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {(features ?? []).map((feature: any, i: number) => {
            const Icon = feature?.icon ?? Shield;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Card variant="interactive" className="p-6 h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{feature?.title ?? ''}</h3>
                    <p className="text-sm text-muted-foreground">{feature?.description ?? ''}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">CryptoXchange</span>
          </div>
          <p>&copy; 2026 CryptoXchange. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
