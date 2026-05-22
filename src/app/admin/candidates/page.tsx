import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { listPendingCandidates } from '@/server/db/queries/admin';
import { requireAdmin } from '@/server/auth';
import { approveCandidateAction, rejectCandidateAction } from '../actions';

export default async function AdminCandidates(){ await requireAdmin(); const rows = await listPendingCandidates(); return <Card><CardHeader><CardTitle>Pending candidates</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Candidate ID</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{rows.map((c)=><TableRow key={c.id}><TableCell className='font-mono text-xs'>{c.id}</TableCell><TableCell className='space-x-2'><form action={approveCandidateAction} className='inline'><input type='hidden' name='candidateId' value={c.id}/><Button size='sm'>Approve</Button></form><form action={rejectCandidateAction} className='inline'><input type='hidden' name='candidateId' value={c.id}/><Button variant='destructive' size='sm'>Reject</Button></form></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>; }
