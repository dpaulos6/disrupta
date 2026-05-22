import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AdminLayout({children}:{children:React.ReactNode}){return <main className='mx-auto max-w-6xl space-y-4 p-8'><div className='flex items-center justify-between'><h1 className='text-2xl font-bold'>Disrupta Admin</h1><div className='flex gap-2'><Button variant='outline' asChild><Link href='/admin'>Overview</Link></Button><Button variant='outline' asChild><Link href='/admin/candidates'>Candidates</Link></Button></div></div><Separator />{children}</main>;}
