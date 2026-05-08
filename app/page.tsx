import { Header } from '@/components/header';
import { LandingContent } from './_components/landing-content';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LandingContent />
    </div>
  );
}
