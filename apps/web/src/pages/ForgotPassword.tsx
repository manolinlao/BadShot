import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/auth/client';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(undefined);
    setError(undefined);
    setIsSubmitting(true);

    try {
      const result = await requestPasswordReset(email);
      setMessage(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo solicitar la recuperación.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-[32px] border border-[#e2d6ca] bg-white/85 p-5 shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
        Account recovery
      </p>
      <h1 className="mt-2 text-2xl font-black text-[#211a16]">
        Forgot your password?
      </h1>
      <p className="mt-2 text-sm leading-6 text-[#5f4a3f]">
        Enter your email and we will send you a secure reset link.
      </p>

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

        {message ? (
          <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#211a16] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2f2621] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <Link
        to="/login"
        className="mt-6 inline-flex text-sm font-semibold text-[#7a4d2a] hover:text-[#211a16]"
      >
        Back to login
      </Link>
    </section>
  );
}
