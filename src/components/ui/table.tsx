import * as React from 'react';
import { cn } from '@/lib/utils/cn';
export const Table = (p: React.HTMLAttributes<HTMLTableElement>) => <div className='w-full overflow-auto'><table {...p} className={cn('w-full caption-bottom text-sm', p.className)} /></div>;
export const TableHeader = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <thead {...p} className={cn('[&_tr]:border-b', p.className)} />;
export const TableBody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p} className={cn('[&_tr:last-child]:border-0', p.className)} />;
export const TableRow = (p: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...p} className={cn('border-b hover:bg-slate-50', p.className)} />;
export const TableHead = (p: React.ThHTMLAttributes<HTMLTableCellElement>) => <th {...p} className={cn('h-10 px-2 text-left align-middle font-medium text-slate-600', p.className)} />;
export const TableCell = (p: React.TdHTMLAttributes<HTMLTableCellElement>) => <td {...p} className={cn('p-2 align-middle', p.className)} />;
