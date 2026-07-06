import Link from 'next/link';
import { resetPasswordAction } from '@/app/auth/actions';

export default async function ResetPasswordPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="bolt">↯</span> Stormyy</Link>
        <h1>Reset password</h1>
        <p className="subtle">We'll send you a reset link by email.</p>
        {searchParams.message && <div className="success">{searchParams.message}</div>}
        {searchParams.error && <div className="error">{searchParams.error}</div>}
        <form className="form" action={resetPasswordAction}>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <button className="btn btn-primary" type="submit">Send reset link</button>
        </form>
        <div className="auth-links"><Link href="/login">Back to login</Link></div>
      </div>
    </main>
  );
}
