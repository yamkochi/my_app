import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import bcrypt from "bcryptjs"
import fs from "fs/promises"
import path from "path"

// Fetch roles for the dropdown
export async function GET() {
  // console.log("anand here api/empxxx")
  try {
    //  console.log("anand here api/emp")
    const [roles] = await pool.query("SELECT id, role_name FROM role")
    //  console.log(roles)
    return NextResponse.json(roles)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Handle form submission
export async function POST(request) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const formData = await request.formData()

    // Extract text fields
    const name = formData.get("name")
    const role_id = formData.get("role_id")
    const email = formData.get("email")
    const role_desc = formData.get("role_desc")
    const date_joined = formData.get("date_joined")
    const password = formData.get("password")
    const vip = formData.get("vip") === "true" ? 1 : 0
    const admin = formData.get("admin") === "true" ? 1 : 0
    const lat = formData.get("lat") ? parseFloat(formData.get("lat")) : null
    const lng = formData.get("lng") ? parseFloat(formData.get("lng")) : null
    const logtime = formData.get("logtime") || null
    const file = formData.get("photo")

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert initially without photo_url to get the Insert ID
    const [result] = await connection.query(
      `INSERT INTO employee (name, role_id, email, role_desc, date_joined, password, vip, admin, lat, lng, logtime) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        role_id,
        email,
        role_desc,
        date_joined,
        hashedPassword,
        vip,
        admin,
        lat,
        lng,
        logtime,
      ],
    )

    const empId = result.insertId
    const filename = `${empId}.png`
    const relativePath = `/empimage/${filename}`

    // Save image locally if provided
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const uploadDir = path.join(process.cwd(), "public", "empimage")
      await fs.mkdir(uploadDir, { recursive: true })
      await fs.writeFile(path.join(uploadDir, filename), buffer)
    }

    // Update the record with the matching generated photo_url path
    await connection.query("UPDATE employee SET photo_url = ? WHERE id = ?", [
      relativePath,
      empId,
    ])

    await connection.commit()
    return NextResponse.json({ success: true, id: empId })
  } catch (error) {
    await connection.rollback()
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    connection.release()
  }
}
