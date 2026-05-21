import Link from 'next/link';
import { listEvents } from '@/server/db/queries/events';

export default async function HomePage() {
  const upcoming = await listEvents({ pageSize: 5, page: 1 });
  return <main className='mx-auto max-w-5xl space-y-8 p-8'>
    <section className='space-y-3'><h1 className='text-4xl font-bold'>Disrupta</h1><p className='text-slate-700'>Disrupta Portugal is a public, source-linked disruption tracker for Portugal.</p><div className='flex gap-4'><Link href='/events' className='underline'>Browse disruptions</Link><a href='https://github.com' className='underline'>Contribute on GitHub</a></div></section>
    <section><h2 className='text-xl font-semibold'>Upcoming disruptions</h2><ul className='mt-3 space-y-2'>{upcoming.map((e)=><li key={e.id}><Link className='underline' href={`/events/${e.slug}`}>{e.title}</Link> · {e.category}</li>)}</ul></section>
  </main>;
}
