import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { events, eventSources } from '@/server/db/schema';
import { and, eq, gte } from 'drizzle-orm';

export async function GET() {
  const now = new Date();
  const rows = await db.select({ e: events, s: eventSources }).from(events).leftJoin(eventSources, eq(eventSources.eventId, events.id)).where(and(gte(events.startsAt, now), eq(events.verificationStatus, 'reviewed')));
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Disrupta//Disrupta Portugal//EN'];
  for (const row of rows) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${row.e.id}@disrupta.pt`);
    lines.push(`SUMMARY:${row.e.title}`);
    lines.push(`DTSTART:${row.e.startsAt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`);
    if (row.e.endsAt) lines.push(`DTEND:${row.e.endsAt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`);
    lines.push(`DESCRIPTION:${row.e.summary}\\nSource:${row.s?.url ?? 'N/A'}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return new NextResponse(lines.join('\n'), { headers: { 'content-type': 'text/calendar; charset=utf-8', 'cache-control': 'public, s-maxage=300' } });
}
