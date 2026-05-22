import { Badge } from '@/components/ui/badge';

export function EventStatusBadge({ status }: { status: string }) {
  const tone = status === 'confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-700';
  return <Badge className={tone}>{status}</Badge>;
}

export function EventSeverityBadge({ severity }: { severity: string }) {
  const tone = severity === 'critical' ? 'bg-red-50 border-red-200 text-red-700' : severity === 'high' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-700';
  return <Badge className={tone}>{severity}</Badge>;
}

export function EventCategoryBadge({ category }: { category: string }) {
  return <Badge className='bg-blue-50 border-blue-200 text-blue-700'>{category}</Badge>;
}
