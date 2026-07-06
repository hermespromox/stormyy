import Link from 'next/link';
import { redirect } from 'next/navigation';
import { updatePasswordAction } from '@/app/auth/actions';
import { getCurrentUser } from '@/lib/supabase/server';

export default async function UpdatePasswordPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="bolt">↯</span> Stormyy</Link>
        <h1>Set new password</h1>
        <p className="subtle">Choose a new password for your account.</p>
        {searchParams.message && <div className="success">{searchParams.message}</div>}
        {searchParams.error && <div className="error">{searchParams.error}</div>}
        <form className="form" action={updatePasswordAction}>
          <label>New password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
          <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></label>
          <button className="btn btn-primary" type="submit">Update password</button>
        </form>
      </div>
    </main>
  );
}
