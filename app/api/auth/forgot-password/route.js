// app/api/auth/forgot-password/route.js
import { pool } from "@/lib/db"
import nodemailer from "nodemailer"

function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString() // Generates 4-digit string
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

    // Security practice: don't reveal if email exists or not
    if (rows.length === 0) {
      return Response.json({
        success: true,
        message: "If the account exists, a verification code has been sent.",
      })
    }

    const employee = rows[0]
    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // Code valid for 15 minutes

    // Save the code and expiry time to the database
    await pool.execute(
      "UPDATE employee SET reset_code = ?, reset_expires_at = ? WHERE id = ?",
      [verificationCode, expiresAt, employee.id],
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

    await transporter.sendMail({
      from: `"Enterprise Security" <${process.env.SMTP_USER}>`,
      to: email.trim(),
      subject: "Your Password Reset Verification Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Verification Code</h2>
          <p>Hello ${employee.name},</p>
          <p>You requested to reset your password. Use the 4-digit verification code below to proceed:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; display: inline-block; color: #111827; margin: 15px 0;">
            ${verificationCode}
          </div>
          <p>This code is valid for 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    })

    return Response.json({
      success: true,
      message: "A 4-digit verification code has been dispatched to your inbox.",
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
