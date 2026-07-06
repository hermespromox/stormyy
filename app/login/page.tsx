import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loginAction } from '@/app/auth/actions';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';

export default async function LoginPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  const user = await getCurrentConfirmedUser();
  if (user) redirect('/app');

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="bolt">↯</span> Stormyy</Link>
        <h1>Welcome back</h1>
        <p className="subtle">Log in to continue brainstorming.</p>
        {searchParams.message && <div className="success">{searchParams.message}</div>}
        {searchParams.error && <div className="error">{searchParams.error}</div>}
        <form className="form" action={loginAction}>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="btn btn-primary" type="submit">Log in</button>
        </form>
        <div className="auth-links">
          <Link href="/reset-password">Forgot password?</Link> · <Link href="/signup">Create account</Link>
        </div>
      </div>
    </main>
  );
}
