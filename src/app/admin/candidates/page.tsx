import { listPendingCandidates } from '@/server/db/queries/admin';
import { requireAdmin } from '@/server/auth';
import { approveCandidateAction, rejectCandidateAction } from '../actions';

export default async function AdminCandidates(){ await requireAdmin(); const rows = await listPendingCandidates(); return <section className='space-y-4'><h2 className='text-xl font-semibold'>Pending candidates</h2>{rows.map((c)=><div key={c.id} className='rounded border p-3'><p>ID: {c.id}</p><form action={approveCandidateAction} className='inline'><input type='hidden' name='candidateId' value={c.id}/><button className='mr-2 border px-2 py-1'>Approve</button></form><form action={rejectCandidateAction} className='inline'><input type='hidden' name='candidateId' value={c.id}/><button className='border px-2 py-1'>Reject</button></form></div>)}</section>; }
