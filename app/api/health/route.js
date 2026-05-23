import { pool } from "@/lib/db"
import nodemailer from "nodemailer"
import { env } from "@/lib/env"

export async function GET(request) {
  // 1. GET THE SOURCE ORIGIN HEADER
  const origin = request.headers.get("origin")

  // 2. DEFINE EXCLUSIVE WHIETLIST SITES
  const allowedOrigins = ["http://localhost:3000", "https://yamkochi.com"]

  // Validate the request origin (skip if direct server-to-server call with no origin header)
  if (origin && !allowedOrigins.includes(origin)) {
    return new Response(
      JSON.stringify({ error: "CORS Blocked: Access Denied" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  // 3. SECURE SECURITY TOKEN VALIDATION
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null
  const { searchParams } = new URL(request.url)
  const queryToken = searchParams.get("secret")
  const providedToken = token || queryToken

  if (!providedToken || providedToken !== env.CRON_SECRET) {
    return Response.json(
      { error: "Unauthorized: Invalid or missing security token" },
      { status: 401 },
    )
  }

  const statusReport = {
    timestamp: new Date().toISOString(),
    services: {
      database: { status: "unknown", message: null },
      smtp: { status: "unknown", message: null },
    },
  }

  // TEST DATABASE CONNECTION
  try {
    await pool.execute("SELECT 1")
    statusReport.services.database.status = "healthy"
  } catch (dbError) {
    statusReport.services.database.status = "unhealthy"
    statusReport.services.database.message = dbError.message
  }

  // TEST SMTP CONNECTION
  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })

    await transporter.verify()
    statusReport.services.smtp.status = "healthy"
  } catch (smtpError) {
    statusReport.services.smtp.status = "unhealthy"
    statusReport.services.smtp.message = smtpError.message
  }

  const overallHealthy =
    statusReport.services.database.status === "healthy" &&
    statusReport.services.smtp.status === "healthy"

  // 4. ATTACH THE REQUIRED CORS HEADERS TO RESPONSE
  const responseHeaders = {
    "Content-Type": "application/json",
  }

  // Echo back the origin if it matches our whitelist criteria
  if (origin && allowedOrigins.includes(origin)) {
    responseHeaders["Access-Control-Allow-Origin"] = origin
    responseHeaders["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    responseHeaders["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization"
  }

  return new Response(JSON.stringify(statusReport), {
    status: overallHealthy ? 200 : 500,
    headers: responseHeaders,
  })
}

// 5. HANDLE PRE-FLIGHT CORS REQUESTS (Required for custom headers/methods)
export async function OPTIONS(request) {
  const origin = request.headers.get("origin")
  const allowedOrigins = ["http://localhost:3000", "https://yamkochi.com"]

  if (origin && allowedOrigins.includes(origin)) {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }

  return new Response(null, { status: 403 })
}
