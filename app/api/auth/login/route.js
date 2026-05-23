import { pool } from "@/lib/db"
import { createSession } from "../session"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      )
    }

    const [rows] = await pool.execute(
      "SELECT id, name, email, password, photo_url, admin FROM employee WHERE email = ? LIMIT 1",
      [email.trim()],
    )

    if (rows.length === 0) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const employee = rows[0]

    // 1. SAFELY CHECK PASSWORD FIELD (Prevents 500 error if DB cell is null)
    if (!employee.password) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password)

    if (!isPasswordValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    // 2. SAFELY CHECK ADMIN FIELD (Handles null column states safely)
    let isAdmin = false
    if (employee.admin !== null && employee.admin !== undefined) {
      isAdmin = Buffer.isBuffer(employee.admin)
        ? employee.admin.readInt8(0) === 1
        : !!employee.admin
    }

    const userPayload = {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      photo_url: employee.photo_url || "https://unsplash.com",
      isAdmin: isAdmin,
    }

    // 3. ATTEMPT SESSION CREATION
    try {
      await createSession(userPayload)
    } catch (sessionError) {
      console.error("Session creation failed:", sessionError)
      return Response.json(
        {
          error:
            "Session creation failed. Check your token environment variables.",
        },
        { status: 500 },
      )
    }

    return Response.json({ success: true, user: userPayload })
  } catch (error) {
    // This logs the exact error string into your VS Code terminal console
    console.error("Login API Error Detail:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
