import { headers } from 'next/headers';
import { adminEmails } from '@/lib/env/server';
export async function getSessionUserEmail() { return (await headers()).get('x-user-email'); }
export function isAdminEmail(email: string | null) { return !!email && adminEmails.includes(email.toLowerCase()); }
export async function requireAdmin() { const email = await getSessionUserEmail(); if (!isAdminEmail(email)) throw new Error('Unauthorized admin access'); return { email }; }
