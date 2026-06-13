import { ShotCard } from '../components/shot/ShotCard';
import { mockShots } from '../data/mockShots';

export function Home() {
  return (
    <section className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]'>
      <div className='space-y-5'>
        {mockShots.map((shot) => (
          <ShotCard key={shot.id} shot={shot} />
        ))}
      </div>

      <aside className='h-fit rounded-lg border border-[#e2d6ca] bg-[#fffaf5] p-5'>
        <p className='mb-3 text-sm font-bold uppercase text-[#7a4d2a]'>BadShot</p>
        <h1 className='text-3xl font-black leading-tight'>
          Your espresso social journal starts here.
        </h1>
        <p className='mt-4 text-sm leading-6 text-[#4a3a31]'>
          This feed is using local mock data for now. Later, these shots will come from the API.
        </p>
      </aside>
    </section>
  );
}
