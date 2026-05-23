import { z } from "zod"

const envSchema = z.object({
  SMTP_HOST: z.string().min(1).default("smtp.hostinger.com"),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_SECURE: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .default(false),
  SMTP_USER: z.email(), // Updated to the modern non-deprecated Zod syntax
  SMTP_PASS: z.string().min(1),
  CRON_SECRET: z.string().min(8),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid Environment Variables:",
    JSON.stringify(parsedEnv.error.format(), null, 2),
  )
  throw new Error("Invalid environment variables")
}
