import { NextRequest, NextResponse } from 'next/server';
import { approveCandidateEventProcedure, listCandidateEventsProcedure, rejectCandidateEventProcedure } from '@/server/orpc/procedures/admin';
import { getEventBySlugProcedure, listEventsProcedure, listSourcesProcedure } from '@/server/orpc/procedures/public';

export async function POST(request: NextRequest, { params }: { params: Promise<{ rest?: string[] }> }) {
  const { rest } = await params;
  const body = await request.json().catch(() => ({}));
  const path = (rest ?? []).join('/');
  if (path === 'public/listEvents') return NextResponse.json(await listEventsProcedure(body));
  if (path === 'public/getEventBySlug') return NextResponse.json(await getEventBySlugProcedure(body));
  if (path === 'public/listSources') return NextResponse.json(await listSourcesProcedure());
  if (path === 'admin/listCandidateEvents') return NextResponse.json(await listCandidateEventsProcedure());
  if (path === 'admin/approveCandidateEvent') return NextResponse.json(await approveCandidateEventProcedure(body));
  if (path === 'admin/rejectCandidateEvent') return NextResponse.json(await rejectCandidateEventProcedure(body));
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
