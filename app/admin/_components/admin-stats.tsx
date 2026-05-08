'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileStack, Clock, CheckCircle2, Banknote, XCircle, Loader2 } from 'lucide-react';

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
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Total Transactions', value: stats?.totalTransactions ?? 0, icon: FileStack, color: 'text-primary bg-primary/10' },
    { label: 'Pending', value: stats?.pendingCount ?? 0, icon: Clock, color: 'text-yellow-500 bg-yellow-500/10' },
    { label: 'Confirmed', value: stats?.confirmedCount ?? 0, icon: CheckCircle2, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Credited', value: stats?.creditedCount ?? 0, icon: Banknote, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Rejected', value: stats?.rejectedCount ?? 0, icon: XCircle, color: 'text-red-500 bg-red-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {(statCards ?? []).map((stat: any, i: number) => {
        const Icon = stat?.icon ?? FileStack;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <Card variant="interactive">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat?.color ?? ''}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat?.label ?? ''}</p>
                    <p className="font-display text-2xl font-bold">{stat?.value ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
