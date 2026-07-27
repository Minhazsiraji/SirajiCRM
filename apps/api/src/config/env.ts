import { z } from 'zod';

/**
 * Fail fast on boot if the environment is misconfigured. A missing
 * META_APP_SECRET is not something to discover when the first forged webhook
 * arrives. Optional keys are validated only for shape, not presence, so the
 * app boots for local inbox work before the AI and courier keys exist.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(3001),
  WEB_URL: z.string().url().default('http://localhost:3000'),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  // Optional so the app boots for local dashboard / manual-inbox work before
  // any Meta credentials exist. The webhook routes still fail closed at request
  // time — MetaSignatureGuard and the verify handler call getOrThrow — so an
  // unconfigured deployment can never accept a forged or unverified webhook.
  META_APP_SECRET: z.string().optional(),
  META_VERIFY_TOKEN: z.string().optional(),
  META_GRAPH_VERSION: z.string().default('v21.0'),

  FB_PAGE_ID: z.string().optional(),
  FB_PAGE_ACCESS_TOKEN: z.string().optional(),

  WA_PHONE_NUMBER_ID: z.string().optional(),
  WA_ACCESS_TOKEN: z.string().optional(),

  ANTHROPIC_API_KEY: z.string().optional(),
  EXTRACTION_MODEL: z.string().default('claude-haiku-4-5-20251001'),
  REPLY_MODEL: z.string().default('claude-sonnet-5'),

  COURIER_PROVIDER: z.string().default('steadfast'),
  COURIER_API_KEY: z.string().optional(),
  COURIER_API_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = EnvSchema.safeParse(config);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment:\n${issues}`);
  }
  return parsed.data;
}
