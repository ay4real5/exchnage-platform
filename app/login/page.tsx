import { Header } from '@/components/header';
import { LoginForm } from './_components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LoginForm />
    </div>
  );
}
