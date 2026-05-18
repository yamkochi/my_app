import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    const query =
      "SELECT id, name, nxt_inspection_dt, icon_url_a, icon_url_b, active FROM project ORDER BY name ASC"
    const [rows] = await pool.query(query)

    const formattedRows = rows.map((row) => ({
      ...row,
      active: row.active
        ? Boolean(row.active.readInt8 ? row.active.readInt8(0) : row.active)
        : false,
    }))

    return NextResponse.json(formattedRows)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT: Process array list of active field statuses using transaction query execution
export async function PUT(request) {
  const connection = await pool.getConnection()
  try {
    const { items } = await request.json()
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid data format context." },
        { status: 400 },
      )
    }

    // Begin standard isolated database pool transaction sequence block
    await connection.beginTransaction()

    const query = "UPDATE project SET active = ? WHERE id = ?"
    for (const item of items) {
      const binaryActiveValue = item.active ? 1 : 0
      await connection.query(query, [binaryActiveValue, item.id])
    }

    // Commit changes cleanly to disk tables
    await connection.commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    // Roll back operational states if error throws midway
    await connection.rollback()
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    // Release active worker pool resource context trace cleanly back to server allocations
    connection.release()
  }
}
