// app/api/auth/profile/upload/route.js
import pool from "@/lib/db"
import { getSession, createSession } from "../../session"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request) {
  try {
    // 1. Authenticate user session
    const session = await getSession()
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse incoming FormData
    const formData = await request.formData()
    const file = formData.get("image")

    if (!file) {
      return Response.json({ error: "No image file provided" }, { status: 400 })
    }

    // Convert file object to buffer stream
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 3. Setup directory targets inside Next.js public directory
    const uploadDir = path.join(process.cwd(), "public", "empimage")

    // Ensure folder structure exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Directory already exists
    }

    // Explicit file naming token constraint matching employee id
    const fileName = `${session.id}.png`
    const absoluteFilePath = path.join(uploadDir, fileName)

    // 4. Save the binary asset file securely to disk filesystem
    await writeFile(absoluteFilePath, buffer)

    // Path string format to save to database for client mapping
    const publicPhotoUrlPath = `/empimage/${fileName}`

    // 5. Commit change to MySQL connection pool row vector
    await pool.execute("UPDATE employee SET photo_url = ? WHERE id = ?", [
      publicPhotoUrlPath,
      session.id,
    ])

    // 6. Overwrite active session cookie payload so layout renders instantly
    const [rows] = await pool.execute(
      "SELECT id, name, email, photo_url, admin, lat, lan FROM employee WHERE id = ? LIMIT 1",
      [session.id],
    )
    const updated = rows[0]

    const isAdmin = Buffer.isBuffer(updated.admin)
      ? updated.admin.readInt8(0) === 1
      : !!updated.admin

    const userPayload = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      photo_url: updated.photo_url,
      isAdmin: isAdmin,
      lat: updated.lat,
      lan: updated.lan,
    }

    await createSession(userPayload)

    return Response.json({ success: true, photo_url: publicPhotoUrlPath })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
