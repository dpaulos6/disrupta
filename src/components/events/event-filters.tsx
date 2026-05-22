import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function EventFilters({ params }: { params: Record<string, string | undefined> }) {
  return <form className='grid grid-cols-1 gap-2 md:grid-cols-4'><Input name='q' placeholder='Search disruptions' defaultValue={params.q} /><Input name='district' placeholder='District' defaultValue={params.district} /><Input name='municipality' placeholder='Municipality' defaultValue={params.municipality} /><Button variant='outline' type='submit'>Apply filters</Button></form>;
}
