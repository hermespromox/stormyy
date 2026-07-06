import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signUpAction } from '@/app/auth/actions';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';

export default async function SignupPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  const user = await getCurrentConfirmedUser();
  if (user) redirect('/app');

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="bolt">↯</span> Stormyy</Link>
        <h1>Create account</h1>
        <p className="subtle">Start brainstorming with multi-model Fusion.</p>
        {searchParams.message && <div className="success">{searchParams.message}</div>}
        {searchParams.error && <div className="error">{searchParams.error}</div>}
        <form className="form" action={signUpAction}>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
          <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></label>
          <button className="btn btn-primary" type="submit">Create account</button>
        </form>
        <div className="auth-links"><Link href="/login">Already have an account? Log in</Link></div>
      </div>
    </main>
  );
}
