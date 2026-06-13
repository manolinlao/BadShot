import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="max-w-xl">
      <p className="mb-3 text-sm font-bold uppercase text-[#7a4d2a]">
        Not found
      </p>
      <h1 className="text-4xl font-bold">This page does not exist.</h1>
      <Link
        to="/"
        className="mt-6 inline-flex rounded bg-[#211a16] px-4 py-2 text-sm font-semibold text-white"
      >
        Back home
      </Link>
    </section>
  )
}
