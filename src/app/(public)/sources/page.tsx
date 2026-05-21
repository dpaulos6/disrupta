import { listSources } from '@/server/db/queries/sources';
export default async function SourcesPage(){ const rows = await listSources(); return <main className='mx-auto max-w-5xl p-8'><h1 className='text-2xl font-semibold'>Sources</h1><ul className='mt-4 space-y-2'>{rows.map((s)=><li key={s.id}><a href={s.url} className='underline'>{s.name}</a> · {s.type} · {s.adapterKey}</li>)}</ul></main>; }
