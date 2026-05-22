import { notFound } from 'next/navigation';
import { EventCategoryBadge, EventSeverityBadge, EventStatusBadge } from '@/components/events/event-badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getEventBySlug } from '@/server/db/queries/events';

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getEventBySlug(slug);
  if (!data) notFound();
  return <main className='mx-auto max-w-4xl space-y-4 p-8'>
    <Card><CardHeader><CardTitle>{data.event.title}</CardTitle></CardHeader><CardContent className='space-y-3'><p>{data.event.summary}</p><p>{data.event.description}</p><div className='flex gap-2'><EventCategoryBadge category={data.event.category} /><EventStatusBadge status={data.event.status} /><EventSeverityBadge severity={data.event.severity} /></div></CardContent></Card>
    <Separator />
    <Card><CardHeader><CardTitle>Source links</CardTitle></CardHeader><CardContent><ul className='space-y-2'>{data.sources.map((s)=><li key={s.id}><a href={s.url} className='underline'>{s.url}</a></li>)}</ul></CardContent></Card>
  </main>;
}
