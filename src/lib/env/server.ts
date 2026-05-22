import { z } from 'zod';
const schema = z.object({ DATABASE_URL: z.string().url(), ADMIN_EMAILS: z.string().default(''), BETTER_AUTH_SECRET: z.string().min(1).default('dev-secret'), BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'), NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'), NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(), NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(), NODE_ENV: z.enum(['development','test','production']).default('development') });
export const env = schema.parse(process.env);
export const adminEmails = env.ADMIN_EMAILS.split(',').map((v)=>v.trim().toLowerCase()).filter(Boolean);
