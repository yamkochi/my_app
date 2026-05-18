import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import bcrypt from "bcryptjs"
import fs from "fs/promises"
import path from "path"

// Fetch single employee data & available roles
export async function GET(request, { params }) {
  try {
    const { id } = await params
    console.log("anand in api emp id")
    console.log(id)
    // Fetch employee data
    const [employees] = await pool.query(
      "SELECT * FROM employee WHERE id = ?",
      [id],
    )
    if (employees.length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Fetch roles list for the selector dropdown
    const [roles] = await pool.query("SELECT id, role_name FROM role")

    return NextResponse.json({ employee: employees[0], roles })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
    const lng = formData.get("lng") ? parseFloat(formData.get("lng")) : null
    const logtime = formData.get("logtime") || null
    const file = formData.get("photo")

    // Build conditional query fields
    let queryFields = `
      name = ?, role_id = ?, email = ?, role_desc = ?, 
      date_joined = ?, vip = ?, admin = ?, lat = ?, lng = ?, logtime = ?
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
      lng,
      logtime,
    ]

    // If user provided a new password, encrypt it and append to the query
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10)
      queryFields += `, password = ?`
      queryParams.push(hashedPassword)
    }

    // Handle new photo upload if selected
    if (file && file.size > 0) {
      const filename = `${id}.png`
      const buffer = Buffer.from(await file.arrayBuffer())
      const uploadDir = path.join(process.cwd(), "public", "empimage")

      await fs.mkdir(uploadDir, { recursive: true })
      await fs.writeFile(path.join(uploadDir, filename), buffer)

      // Explicitly set photo_url just in case it wasn't mapped originally
      const relativePath = `/empimage/${filename}`
      queryFields += `, photo_url = ?`
      queryParams.push(relativePath)
    }

    // Execute query targeting the record ID
    queryParams.push(id)
    await connection.query(
      `UPDATE employee SET ${queryFields} WHERE id = ?`,
      queryParams,
    )

    await connection.commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    await connection.rollback()
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    connection.release()
  }
}

// Append this method to src/app/api/employees/[id]/route.js

export async function DELETE(request, { params }) {
  const { id } = await params
  console.log(`anand in emp del route..., ${id}`)
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // 1. Optional: Read the photo path if you want to delete the file from storage
    const [employees] = await connection.query(
      "SELECT photo_url FROM employee WHERE id = ?",
      [id],
    )

    if (employees.length > 0 && employees[0].photo_url) {
      const fs = require("fs/promises")
      const path = require("path")
      const filepath = path.join(
        process.cwd(),
        "public",
        employees[0].photo_url,
      )

      // Delete local file safely without breaking execution if missing
      await fs.unlink(filepath).catch(() => null)
    }

    // 2. Delete the record from MySQL database
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
