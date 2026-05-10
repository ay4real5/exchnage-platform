import { DashboardShell } from './_components/dashboard-shell';
import { DashboardOverview } from './_components/dashboard-overview';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardOverview />
    </DashboardShell>
  );
}
