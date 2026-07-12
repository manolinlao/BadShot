import { Link } from 'react-router-dom';

export function Profile() {
  return (
    <section className="mx-auto max-w-2xl rounded-[32px] border border-[#e2d6ca] bg-white/85 p-5 shadow-[0_12px_30px_rgba(49,33,20,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#211a16] text-sm font-black text-white">
          B
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7a4d2a]">
            Profile
          </p>
          <h1 className="text-2xl font-black text-[#211a16]">Your profile</h1>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#5f4a3f]">
        This page will show your shots, coffee stats, followers, and profile
        details.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-[#e2d6ca] bg-white px-4 py-2.5 text-sm font-semibold text-[#5f4a3f] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
        >
          Back home
        </Link>
        <Link
          to="/create"
          className="inline-flex items-center justify-center rounded-full bg-[#211a16] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f2621]"
        >
          Create shot
        </Link>
      </div>
    </section>
  );
}
