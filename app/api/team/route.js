import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// GET: Fetch team members deployed to a specific project
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    const query = "SELECT * FROM project_team WHERE projectId = ?"
    const [team] = await pool.query(query, [projectId])

    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Deploy a member to the project team
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      projectId,
      empId,
      dateFm,
      dateTo,
      task_allotted,
      adlInfo,
      gradeAwarded,
    } = body

    const query = `
      INSERT INTO project_team (projectId, empId, dateFm, dateTo, task_allotted, adlInfo, gradeAwarded)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    const values = [
      projectId,
      empId,
      dateFm || null,
      dateTo || null,
      task_allotted,
      adlInfo,
      gradeAwarded,
    ]
    await pool.query(query, values)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT: Update assignments details for an employee on a project
export async function PUT(request) {
  try {
    const body = await request.json()
    const {
      projectId,
      empId,
      dateFm,
      dateTo,
      task_allotted,
      adlInfo,
      gradeAwarded,
    } = body

    const query = `
      UPDATE project_team 
      SET dateFm=?, dateTo=?, task_allotted=?, adlInfo=?, gradeAwarded=?
      WHERE projectId=? AND empId=?
    `

    const values = [
      dateFm || null,
      dateTo || null,
      task_allotted,
      adlInfo,
      gradeAwarded,
      projectId,
      empId,
    ]
    await pool.query(query, values)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Remove a specific employee deployment mapping
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const empId = searchParams.get("empId")

    const query = "DELETE FROM project_team WHERE projectId = ? AND empId = ?"
    await pool.query(query, [projectId, empId])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
