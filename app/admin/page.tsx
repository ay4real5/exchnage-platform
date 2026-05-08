import { Header } from '@/components/header';
import { AdminContent } from './_components/admin-content';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdminContent />
    </div>
  );
}
