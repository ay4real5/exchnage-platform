'use client';

import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Banknote, XCircle } from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
    icon: CheckCircle2,
  },
  CREDITED: {
    label: 'Credited',
    className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    icon: Banknote,
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
    icon: XCircle,
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig?.[status] ?? statusConfig.PENDING;
  const Icon = config?.icon ?? Clock;
  return (
    <Badge variant="outline" className={config?.className ?? ''}>
      <Icon className="h-3 w-3 mr-1" />
      {config?.label ?? status}
    </Badge>
  );
}
