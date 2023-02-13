import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  APP_PORT: z.string().transform(Number).default('7000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('⚠️ Invalid env vars!', parsedEnv.error.format());

  throw new Error('Invalid env vars!');
}

export const env = parsedEnv.data;
