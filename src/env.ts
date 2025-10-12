/**
 * Parse and validation for env variables
 */

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith("postgresql://"),
  GEMINI_API_KEY: z.string(),
  JWT_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
