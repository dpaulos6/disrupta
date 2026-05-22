import * as React from 'react';
import { cn } from '@/lib/utils/cn';
export function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div role='alert' className={cn('relative w-full rounded-lg border border-slate-200 bg-white p-4 text-slate-950', className)} {...props} />; }
