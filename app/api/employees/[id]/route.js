import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import bcrypt from "bcryptjs"
import fs from "fs/promises"
import path from "path"

// 1. HAVERSINE CALCULATION FUNCTION (Returns distance in kilometers)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null

  const EARTH_RADIUS_KM = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = EARTH_RADIUS_KM * c

  return parseFloat(distance.toFixed(2)) // Returns distance rounded to 2 decimal places
}

// Fetch single employee data & available roles
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const [employees] = await pool.query(
      "SELECT id, name, email, role_id, role_desc, date_joined, vip, admin, lat, lan, photo_url FROM employee WHERE id = ? LIMIT 1",
      [id],
    )

    if (!employees || employees.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    const employee = employees[0]

    // 2. DEFINE HEAD OFFICE COORDINATES (Example: Guindy, Chennai)
    const HEAD_OFFICE_LAT = 13.0067
    const HEAD_OFFICE_LAN = 80.2206

    // 3. COMPUTE THE DISTANCE
    const distanceFromHeadOffice = calculateHaversineDistance(
      HEAD_OFFICE_LAT,
      HEAD_OFFICE_LAN,
      parseFloat(employee.lat),
      parseFloat(employee.lan),
    )

    const [roles] = await pool.query("SELECT id, role_name FROM role")

    // 4. APPEND DISTANCE TO PAYLOAD RESPONSE
    return NextResponse.json({
      employee: {
        ...employee,
        distance_from_hq: distanceFromHeadOffice, // Added to payload
      },
      roles: roles || [],
    })
  } catch (error) {
    console.error("❌ API GET Exception Route Crash:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ... Keep your existing PUT and DELETE routes below ...

// Update employee record
export async function PUT(request, { params }) {
  const { id } = await params
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    const formData = await request.formData()

    const name = formData.get("name")
    const role_id = formData.get("role_id")
    const email = formData.get("email")
    const role_desc = formData.get("role_desc")
    const date_joined = formData.get("date_joined")
    const password = formData.get("password")
    const vip = formData.get("vip") === "true" ? 1 : 0
    const admin = formData.get("admin") === "true" ? 1 : 0
    const lat = formData.get("lat") ? parseFloat(formData.get("lat")) : null

    // 2. FIXED: Changed 'lng' variable assignment to pull from form but write to 'lan' database field
    const lan =
      formData.get("lan") || formData.get("lng")
        ? parseFloat(formData.get("lan") || formData.get("lng"))
        : null

    const logtime = formData.get("logtime") || null
    const file = formData.get("photo")

    // 3. FIXED: Changed 'lng = ?' to 'lan = ?' in the SQL update command template string
    let queryFields = `
      name = ?, role_id = ?, email = ?, role_desc = ?, 
      date_joined = ?, vip = ?, admin = ?, lat = ?, lan = ?, logtime = ?
    `
    let queryParams = [
      name,
      role_id,
      email,
      role_desc,
      date_joined,
      vip,
      admin,
      lat,
      lan,
      logtime,
    ]

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10)
      queryFields += `, password = ?`
      queryParams.push(hashedPassword)
    }

    if (file && file.size > 0) {
      const filename = `${id}.png`
      const buffer = Buffer.from(await file.arrayBuffer())
      const uploadDir = path.join(process.cwd(), "public", "empimage")

      await fs.mkdir(uploadDir, { recursive: true })
      await fs.writeFile(path.join(uploadDir, filename), buffer)

      const relativePath = `/empimage/${filename}`
      queryFields += `, photo_url = ?`
      queryParams.push(relativePath)
    }

    queryParams.push(id)
    await connection.query(
      `UPDATE employee SET ${queryFields} WHERE id = ?`,
      queryParams,
    )

    await connection.commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    await connection.rollback()
    console.error("❌ API PUT Exception Route Crash:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    connection.release()
  }
}

// Keep your existing DELETE method below...
export async function DELETE(request, { params }) {
  const { id } = await params
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [employees] = await connection.query(
      "SELECT photo_url FROM employee WHERE id = ?",
      [id],
    )
    if (employees.length > 0 && employees[0].photo_url) {
      const filepath = path.join(
        process.cwd(),
        "public",
        employees[0].photo_url,
      )
      await fs.unlink(filepath).catch(() => null)
    }
    await connection.query("DELETE FROM employee WHERE id = ?", [id])
    await connection.commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    await connection.rollback()
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    connection.release()
  }
}
