import Link from 'next/link';
import { listEvents } from '@/server/db/queries/events';

export default async function EventsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const rows = await listEvents(params);
  return <main className='mx-auto max-w-5xl p-8'><h1 className='text-2xl font-semibold'>Disruptions</h1><form className='my-4 grid grid-cols-2 gap-2 md:grid-cols-4'><input name='q' placeholder='Search' defaultValue={params.q} className='border p-2'/><input name='district' placeholder='District' defaultValue={params.district} className='border p-2'/><input name='municipality' placeholder='Municipality' defaultValue={params.municipality} className='border p-2'/><button className='border p-2'>Filter</button></form><ul className='space-y-2'>{rows.map((e)=><li key={e.id}><Link href={`/events/${e.slug}`} className='underline'>{e.title}</Link> <span>{e.status}</span></li>)}</ul></main>;
}
