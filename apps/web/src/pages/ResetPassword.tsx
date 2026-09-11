import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/auth/client';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (!token) {
      setError('Este enlace de recuperación no es válido.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      navigate('/login', {
        state: { flash: 'Contraseña actualizada. Ya puedes iniciar sesión.' },
      });
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : 'No se pudo actualizar la contraseña.',
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
        Choose a new password
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-[#5f4a3f]">
            New password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 w-full rounded-2xl border border-[#e2d6ca] bg-white px-4 py-3 text-[#211a16] outline-none focus:border-[#7a4d2a]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-[#5f4a3f]">
            Repeat password
          </span>
          <input
            type="password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-2 w-full rounded-2xl border border-[#e2d6ca] bg-white px-4 py-3 text-[#211a16] outline-none focus:border-[#7a4d2a]"
          />
        </label>

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
          {isSubmitting ? 'Updating...' : 'Update password'}
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
