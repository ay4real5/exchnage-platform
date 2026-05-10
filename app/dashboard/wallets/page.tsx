import { DashboardShell } from '../_components/dashboard-shell';
import { WalletDisplay } from '../_components/wallet-display';

export default function WalletsPage() {
  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-6">Deposit Wallets</h1>
        <WalletDisplay />
      </div>
    </DashboardShell>
  );
}
