// app/api/auth/login/route.js
import { pool } from "@/lib/db"
import { createSession } from "../session"
import bcrypt from "bcryptjs" // Import bcrypt

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Query your MySQL Pool
    const [rows] = await pool.execute(
      "SELECT id, name, email, password, photo_url, admin FROM employee WHERE email = ? LIMIT 1",
      [email],
    )

    if (rows.length === 0) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const employee = rows[0]

    // Use bcrypt to safely compare the plain text with the encrypted password
    const isPasswordValid = await bcrypt.compare(password, employee.password)

    if (!isPasswordValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    // Convert binary(1) or bit buffer to boolean safely
    const isAdmin = Buffer.isBuffer(employee.admin)
      ? employee.admin.readInt8(0) === 1
      : !!employee.admin

    const userPayload = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      photo_url: employee.photo_url || "https://unsplash.com",
      isAdmin: isAdmin, // Maps directly to frontend logic
    }

    await createSession(userPayload)

    return Response.json({ success: true, user: userPayload })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
