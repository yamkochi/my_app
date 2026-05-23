import { z } from "zod"

const envSchema = z.object({
  SMTP_HOST: z.string().default("://hostinger.com"),
  SMTP_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("587"),
  SMTP_SECURE: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),
  CRON_SECRET: z.string().min(8),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error("❌ Invalid Environment Variables:", parsedEnv.error.format())
  throw new Error("Invalid environment variables")
}

// FIX: Ensure this exact named export is present
export const env = parsedEnv.data
