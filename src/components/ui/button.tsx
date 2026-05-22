import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type Size = 'default' | 'sm' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; asChild?: boolean; }

const variants: Record<Variant, string> = { default: 'bg-slate-900 text-white hover:bg-slate-800', secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200', outline: 'border border-slate-300 bg-white hover:bg-slate-50', ghost: 'hover:bg-slate-100', destructive: 'bg-red-600 text-white hover:bg-red-500', link: 'underline-offset-4 hover:underline text-slate-900' };
const sizes: Record<Size, string> = { default: 'h-10 px-4 py-2', sm: 'h-8 px-3 text-sm', lg: 'h-11 px-6' };

export function Button({ className, variant = 'default', size = 'default', asChild = false, children, ...props }: ButtonProps) {
  const cls = cn('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className);
  if (asChild && React.isValidElement(children)) return React.cloneElement(children as React.ReactElement<{ className?: string }>, { className: cn(cls, (children.props as { className?: string }).className) });
  return <button className={cls} {...props}>{children}</button>;
}
