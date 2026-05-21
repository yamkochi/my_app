// app/api/auth/profile/update/route.js
import { pool } from "@/lib/db"
import { getSession } from "../../session"
import bcrypt from "bcryptjs" // Import bcrypt to encrypt the new password text string

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { name, photo_url, lat, lan, password } = await request.json()

    if (!name || name.trim() === "") {
      return Response.json({ error: "Name cannot be empty" }, { status: 400 })
    }

    // 1. Base update execution parameter query arrays
    let query = "UPDATE employee SET name = ?, photo_url = ?, lat = ?, lan = ?"
    let params = [
      name.trim(),
      photo_url.trim() || null,
      lat ? parseFloat(lat) : null,
      lan ? parseFloat(lan) : null,
    ]

    // 2. Dynamic evaluation check: If the employee typed a new password, hash it and append it to the query vector
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return Response.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 },
        )
      }
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      query += ", password = ?"
      params.push(hashedPassword)
    }

    // 3. Append the final filtering criteria conditional matching user ID target constraints
    query += " WHERE id = ?"
    params.push(session.id)

    // Commit parameters seamlessly into the MySQL connection instance
    await pool.execute(query, params)

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
