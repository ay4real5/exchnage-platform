import { DashboardShell } from '../_components/dashboard-shell';
import { TransactionForm } from '../_components/transaction-form';

export default function SendPage() {
  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-6">Send Crypto</h1>
        <TransactionForm />
      </div>
    </DashboardShell>
  );
}
