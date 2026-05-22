import * as React from 'react';
import { cn } from '@/lib/utils/cn';
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={cn('flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm', props.className)} />; }
