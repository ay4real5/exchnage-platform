import { Header } from '@/components/header';
import { DashboardContent } from './_components/dashboard-content';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardContent />
    </div>
  );
}
