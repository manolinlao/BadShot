import { Link } from 'react-router-dom';

export function Register() {
  return (
    <section className="mx-auto max-w-xl rounded-[32px] border border-[#e2d6ca] bg-white/85 p-5 shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
        Account
      </p>
      <h1 className="mt-2 text-2xl font-black text-[#211a16]">
        Create account
      </h1>
      <p className="mt-4 text-sm leading-6 text-[#5f4a3f]">
        This page will eventually contain the registration form for new BadShot
        users.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-full bg-[#211a16] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2621]"
        >
          I already have an account
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
