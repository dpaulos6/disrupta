import { EventCard } from '@/components/events/event-card';
import { EventFilters } from '@/components/events/event-filters';
import { Alert } from '@/components/ui/alert';
import { listEvents } from '@/server/db/queries/events';

export default async function EventsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const rows = await listEvents(params);
  return <main className='mx-auto max-w-5xl space-y-4 p-8'>
    <h1 className='text-2xl font-semibold'>Disruptions</h1>
    <EventFilters params={params} />
    {rows.length === 0 ? <Alert>No disruptions matched the selected filters.</Alert> : <div className='grid gap-3'>{rows.map((e) => <EventCard key={e.id} event={e} />)}</div>}
  </main>;
}
