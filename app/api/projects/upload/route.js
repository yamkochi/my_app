import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import fs from "fs/promises"
import path from "path"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const projectId = formData.get("id")
    const fieldType = formData.get("fieldType") // 'icon_url_a' or 'icon_url_b'
    const file = formData.get("file")

    if (!file || !projectId || !fieldType) {
      return NextResponse.json(
        { error: "Missing mandatory payload data." },
        { status: 400 },
      )
    }

    // Verify it is a PNG file
    if (file.type !== "image/png" && !file.name.endsWith(".png")) {
      return NextResponse.json(
        { error: "Only PNG files are allowed." },
        { status: 400 },
      )
    }

    // Convert file to buffer array
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Setup destination naming convention
    const uniqueFileName = `${projectId}_${fieldType}_${Date.now()}.png`
    const targetDir = path.join(process.cwd(), "public", "icons")

    // Ensure directory exists structural fallback
    await fs.mkdir(targetDir, { recursive: true })

    const targetFilePath = path.join(targetDir, uniqueFileName)
    await fs.writeFile(targetFilePath, buffer)

    // Save absolute public web resolution asset URL reference string
    const publicDatabasePath = `/icons/${uniqueFileName}`

    // Execute safe parameter query execution against mysql pool database hook
    const query = `UPDATE project SET ${fieldType} = ? WHERE id = ?`
    await pool.query(query, [publicDatabasePath, projectId])

    return NextResponse.json({ success: true, savedPath: publicDatabasePath })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
