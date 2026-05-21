import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/server/db/queries/events';

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getEventBySlug(slug);
  if (!data) notFound();
  return <main className='mx-auto max-w-4xl space-y-4 p-8'><h1 className='text-3xl font-bold'>{data.event.title}</h1><p>{data.event.summary}</p><p>{data.event.description}</p><p>Status: {data.event.status} · Severity: {data.event.severity}</p><h2 className='text-xl font-semibold'>Sources</h2><ul>{data.sources.map((s)=><li key={s.id}><a href={s.url} className='underline'>{s.url}</a></li>)}</ul></main>;
}
