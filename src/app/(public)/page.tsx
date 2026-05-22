import Link from 'next/link';
import { EventCard } from '@/components/events/event-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { listEvents } from '@/server/db/queries/events';

export default async function HomePage() {
  const upcoming = await listEvents({ pageSize: 5, page: 1 });
  return <main className='mx-auto max-w-5xl space-y-8 p-8'>
    <Card>
      <CardHeader>
        <CardTitle className='text-3xl'>Disrupta</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-slate-700'>Disrupta Portugal is a public, source-linked disruption tracker for Portugal.</p>
        <div className='flex flex-wrap gap-2'>
          <Badge>Source-linked</Badge><Badge>Community-reviewed</Badge><Badge>Open-source</Badge>
        </div>
        <div className='flex gap-3'>
          <Button asChild><Link href='/events'>Browse disruptions</Link></Button>
          <Button variant='outline' asChild><a href='https://github.com'>Contribute on GitHub</a></Button>
        </div>
      </CardContent>
    </Card>
    <Separator />
    <section className='space-y-3'>
      <h2 className='text-xl font-semibold'>Upcoming disruptions</h2>
      <div className='grid gap-3'>{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>
    </section>
  </main>;
}
