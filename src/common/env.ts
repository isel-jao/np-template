import { z } from 'zod';

const isPort = z.string().regex(/^[1-9][0-9]{3,5}$/);

const envSchema = z.object({
  JWT_SECRET: z.string().default('secret'),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  LOG_LEVEL: z.string().default('debug'),
  PORT: isPort.default('3000').transform((v) => parseInt(v)),
});

const env = envSchema.parse(process.env);

export default env;
