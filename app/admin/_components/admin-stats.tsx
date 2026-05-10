'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileStack, Clock, CheckCircle2, Banknote, XCircle, Loader2, TrendingUp, Activity } from 'lucide-react';

export function AdminStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data ?? {});
    } catch (error: any) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  const total = stats?.totalTransactions ?? 1;
  const approvalRate = total > 0 ? Math.round(((stats?.confirmedCount ?? 0) + (stats?.creditedCount ?? 0)) / total * 100) : 0;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: '#3B82F6' },
    { label: 'Transactions', value: stats?.totalTransactions ?? 0, icon: FileStack, color: '#8B5CF6' },
    { label: 'Pending', value: stats?.pendingCount ?? 0, icon: Clock, color: '#F59E0B' },
    { label: 'Confirmed', value: stats?.confirmedCount ?? 0, icon: CheckCircle2, color: '#06B6D4' },
    { label: 'Credited', value: stats?.creditedCount ?? 0, icon: Banknote, color: '#10B981' },
    { label: 'Rejected', value: stats?.rejectedCount ?? 0, icon: XCircle, color: '#EF4444' },
    { label: 'Approval Rate', value: `${approvalRate}%`, icon: TrendingUp, color: '#22C55E' },
    { label: 'Active Today', value: stats?.pendingCount ?? 0, icon: Activity, color: '#EC4899' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: s.color + '15' }}>
                <Icon className="h-4 w-4" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
