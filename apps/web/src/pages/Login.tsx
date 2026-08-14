import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth/client';

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'No se pudo iniciar sesión',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-[32px] border border-[#e2d6ca] bg-white/85 p-5 shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
        Account
      </p>

      <h1 className="mt-2 text-2xl font-black text-[#211a16]">Log in</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-[#5f4a3f]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="mt-2 w-full rounded-2xl border border-[#e2d6ca] bg-white px-4 py-3 text-[#211a16] outline-none focus:border-[#7a4d2a]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-[#5f4a3f]">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl border border-[#e2d6ca] bg-white px-4 py-3 text-[#211a16] outline-none focus:border-[#7a4d2a]"
          />
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#211a16] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2f2621] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/register"
          className="inline-flex items-center justify-center rounded-full border border-[#e2d6ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#5f4a3f] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
        >
          Create account
        </Link>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-[#e2d6ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#5f4a3f] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
        >
          Back home
        </Link>
      </div>
    </section>
  );
}
