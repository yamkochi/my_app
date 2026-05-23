// app/api/auth/verify-and-reset/route.js
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
    const { email, code } = await request.json()

    if (!email || !code) {
      return Response.json(
        { error: "Email and verification code are required" },
        { status: 400 },
      )
    }

    // Fetch employee, verification code, and expiry time
    const [rows] = await pool.execute(
      "SELECT id, name, reset_code, reset_expires_at FROM employee WHERE email = ? LIMIT 1",
      [email.trim()],
    )

    if (rows.length === 0) {
      return Response.json({ error: "Invalid request" }, { status: 400 })
    }

    const employee = rows[0]

    // Verify code match and ensure it hasn't expired
    const now = new Date()
    if (
      !employee.reset_code ||
      employee.reset_code !== code.trim() ||
      now > new Date(employee.reset_expires_at)
    ) {
      return Response.json(
        { error: "Invalid or expired verification code" },
        { status: 400 },
      )
    }

    // Generate new temporary password
    const temporaryPassword = generateRandomPassword()
    const salt = await bcrypt.genSalt(10)
    const hashedTemporaryPassword = await bcrypt.hash(temporaryPassword, salt)

    // Update password and clear out the used verification codes
    await pool.execute(
      "UPDATE employee SET password = ?, reset_code = NULL, reset_expires_at = NULL WHERE id = ?",
      [hashedTemporaryPassword, employee.id],
    )

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: parseInt(process.env.SMTP_PORT || "465", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "admin@yamkochi.com",
        pass: process.env.SMTP_PASS || "Guindy#1439",
      },
    })

    // Send the final temporary password
    await transporter.sendMail({
      from: `"Enterprise Security" <${process.env.SMTP_USER}>`,
      to: email.trim(),
      subject: "Temporary Password Reset Notification",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Password Reset Successful</h2>
          <p>Hello ${employee.name},</p>
          <p>Your identity has been confirmed. Your temporary 6-character workspace password is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px; display: inline-block; color: #111827; margin: 15px 0;">
            ${temporaryPassword}
          </div>
          <p style="color: #dc2626; font-weight: 500;">Safety warning: Please replace this temporary value with a robust credential right after logging in.</p>
        </div>
      `,
    })

    return Response.json({
      success: true,
      message:
        "Your password has been reset. Check your inbox for your new temporary password.",
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
