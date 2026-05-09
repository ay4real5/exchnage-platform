'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Bitcoin, 
  Banknote, 
  ArrowLeftRight,
  TrendingUp,
  Clock,
  Lock,
  Smartphone,
  CheckCircle2,
  Star
} from 'lucide-react';

const stats = [
  { value: '$2.5M+', label: 'Volume Traded' },
  { value: '50K+', label: 'Happy Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 5 min', label: 'Avg. Processing' },
];

const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Military-grade encryption and multi-layer security protocols protect every transaction.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Average processing time under 5 minutes. Get your money when you need it.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Send crypto from anywhere. Receive NGN or GBP in your local bank account.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Lock,
    title: 'Non-Custodial',
    description: 'We never hold your crypto. Direct wallet-to-bank transfers with full transparency.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Trade on the go with our fully responsive platform. Works perfectly on any device.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: TrendingUp,
    title: 'Best Rates',
    description: 'Competitive exchange rates updated in real-time. No hidden fees or surprises.',
    color: 'from-rose-500 to-red-500',
  },
];

const steps = [
  { 
    icon: Bitcoin, 
    title: 'Connect Wallet', 
    desc: 'Link your crypto wallet or send BTC/USDT to our secure address.',
    step: '01'
  },
  { 
    icon: ArrowLeftRight, 
    title: 'Enter Details', 
    desc: 'Provide your transaction hash and bank account information.',
    step: '02'
  },
  { 
    icon: Banknote, 
    title: 'Receive Cash', 
    desc: 'Get NGN or GBP deposited directly to your bank account.',
    step: '03'
  },
];

const testimonials = [
  {
    name: 'Oluwaseun A.',
    role: 'Crypto Trader',
    content: 'Fastest crypto-to-fiat service I have used. Got my Naira in under 3 minutes!',
    rating: 5,
  },
  {
    name: 'Sarah M.',
    role: 'Freelancer',
    content: 'Reliable and transparent. The rates are competitive and no hidden charges.',
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'Business Owner',
    content: 'I use this weekly for my business. Never had an issue in 6 months.',
    rating: 5,
  },
];

export function LandingContent() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge 
                variant="secondary" 
                className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20"
              >
                <Zap className="h-4 w-4 mr-2" />
                Trusted by 50,000+ users worldwide
              </Badge>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                Crypto to Fiat
              </span>
              <br />
              <span className="text-foreground">Made Simple</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Convert Bitcoin and USDT to Nigerian Naira or British Pounds instantly. 
              Secure, fast, and hassle-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 text-lg"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Three simple steps to convert your crypto to cash
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg bg-card/50 backdrop-blur">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-6xl font-bold text-muted/20">{step.step}</span>
                  </div>
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold tracking-tight mb-4">
              Why Choose CryptoXchange
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Built with security, speed, and user experience in mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold tracking-tight mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-foreground mb-4 italic">&quot;{testimonial.content}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-8 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Trading?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Create your free account in seconds and start converting crypto to fiat today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-primary hover:bg-white/90"
                  >
                    Create Free Account
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 text-white/70 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> No hidden fees
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Instant verification
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> 24/7 support
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <ArrowLeftRight className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-xl font-bold">CryptoXchange</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                The fastest and most secure way to convert your cryptocurrency to fiat currency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/signup" className="hover:text-foreground">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Sign In</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 CryptoXchange. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground">Privacy</Link>
              <Link href="#" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
