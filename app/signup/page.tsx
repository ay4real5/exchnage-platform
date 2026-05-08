import { Header } from '@/components/header';
import { SignupForm } from './_components/signup-form';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SignupForm />
    </div>
  );
}
