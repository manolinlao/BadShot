import { Link } from 'react-router-dom';

export function Login() {
  return (
    <section className='max-w-xl'>
      <p className='mb-3 text-sm font-bold uppercase text-[#7a4d2a]'>Account</p>
      <h1 className='text-4xl font-bold'>Log in</h1>
      <p className='mt-4 text-lg leading-8 text-[#4a3a31]'>
        Authentication will come later. For now this page proves that routing works.
      </p>
      <Link
        to='/register'
        className='mt-6 inline-flex rounded bg-[#211a16] px-4 py-2 text-sm font-semibold text-white'
      >
        Create an account
      </Link>
    </section>
  );
}
