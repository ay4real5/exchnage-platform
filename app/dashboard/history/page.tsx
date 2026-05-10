import { DashboardShell } from '../_components/dashboard-shell';
import { TransactionTimeline } from '../_components/transaction-timeline';

export default function HistoryPage() {
  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-6">Transaction History</h1>
        <TransactionTimeline />
      </div>
    </DashboardShell>
  );
}
