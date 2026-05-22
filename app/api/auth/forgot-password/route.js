// app/api/auth/forgot-password/route.js
import { pool } from "@/lib/db"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"

function generateRandomPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || email.trim() === "") {
      return Response.json(
        { error: "Email address is required" },
        { status: 400 },
      )
    }

    const [rows] = await pool.execute(
      "SELECT id, name FROM employee WHERE email = ? LIMIT 1",
      [email.trim()],
    )

    if (rows.length === 0) {
      return Response.json({
        success: true,
        message: "If the account exists, a new password has been sent.",
      })
    }

    const employee = rows[0]
    const temporaryPassword = generateRandomPassword()

    const salt = await bcrypt.genSalt(10)
    const hashedTemporaryPassword = await bcrypt.hash(temporaryPassword, salt)

    await pool.execute("UPDATE employee SET password = ? WHERE id = ?", [
      hashedTemporaryPassword,
      employee.id,
    ])

    // 1. FIXED: Added "secure: true" for Hostinger's standard Port 465 SSL connection
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: parseInt(process.env.SMTP_PORT || "465", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "admin@yamkochi.com",
        pass: process.env.SMTP_PASS || "Guindy#1439",
      },
    })

    // 2. FIXED: Dynamically bound the "from" address to your authorized matching domain user variable
    await transporter.sendMail({
      from: `"Enterprise Security" <${process.env.SMTP_USER}>`,
      to: email.trim(),
      subject: "Temporary Password Reset Notification",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Password Reset Requested</h2>
          <p>Hello ${employee.name},</p>
          <p>Your account login password has been reset. Please use the temporary 6-letter security credential listed below to log back into the workspace dashboard:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; display: inline-block; color: #111827; margin: 15px 0;">
            ${temporaryPassword}
          </div>
          <p style="color: #dc2626; font-weight: 500;">Safety warning: For security compliance, please replace this temporary value with a robust credential right after logging in.</p>
        </div>
      `,
    })

    return Response.json({
      success: true,
      message:
        "A new temporary password has been successfully dispatched to your inbox.",
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
