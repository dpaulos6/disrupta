import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCategoryBadge, EventSeverityBadge, EventStatusBadge } from './event-badges';

export function EventCard({ event }: { event: { slug: string; title: string; summary: string; status: string; severity: string; category: string } }) {
  return <Card><CardHeader><CardTitle><Link className='hover:underline' href={`/events/${event.slug}`}>{event.title}</Link></CardTitle><CardDescription>{event.summary}</CardDescription></CardHeader><CardContent><div className='flex flex-wrap gap-2'><EventCategoryBadge category={event.category} /><EventStatusBadge status={event.status} /><EventSeverityBadge severity={event.severity} /></div></CardContent></Card>;
}
