import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET: Fetch all projects along with employee reference lists
export async function GET() {
  try {
    const [projects] = await pool.query(
      "SELECT * FROM project ORDER BY created_at DESC",
    )
    const [employees] = await pool.query(
      "SELECT id, name FROM employee ORDER BY name ASC",
    )
    return NextResponse.json({ projects, employees })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Register a new project
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      start_date,
      end_date,
      nxt_inspection_dt,
      team_head,
      location,
      address,
      lat,
      lng,
      icon_url_a,
      icon_url_b,
    } = body

    const query = `
      INSERT INTO project (name, description, start_date, end_date, nxt_inspection_dt, team_head, location, address, lat, lng, created_at, icon_url_a, icon_url_b)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)
    `

    const values = [
      name,
      description,
      start_date || null,
      end_date || null,
      nxt_inspection_dt || null,
      team_head || null,
      location,
      address,
      lat || null,
      lng || null,
      icon_url_a,
      icon_url_b,
    ]
    const [result] = await pool.query(query, values)

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT: Modify an existing project record
export async function PUT(request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      description,
      start_date,
      end_date,
      nxt_inspection_dt,
      team_head,
      location,
      address,
      lat,
      lng,
      icon_url_a,
      icon_url_b,
    } = body

    const query = `
      UPDATE project 
      SET name=?, description=?, start_date=?, end_date=?, nxt_inspection_dt=?, team_head=?, location=?, address=?, lat=?, lng=?, icon_url_a=?, icon_url_b=?
      WHERE id=?
    `

    const values = [
      name,
      description,
      start_date || null,
      end_date || null,
      nxt_inspection_dt || null,
      team_head || null,
      location,
      address,
      lat || null,
      lng || null,
      icon_url_a,
      icon_url_b,
      id,
    ]
    await pool.query(query, values)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Remove project and cascaded references
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // First delete dependent team allocations manually if database lack CASCADE constraints
    await pool.query("DELETE FROM project_team WHERE projectId = ?", [id])
    await pool.query("DELETE FROM project WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
