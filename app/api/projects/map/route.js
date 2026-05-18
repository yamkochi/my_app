import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    // const db = await pool()

    // Select required map fields.
    // Since 'active' is binary, casting to unsigned integer or filtering directly ensures clean JSON serialization.
    const [rows] = await pool.execute(
      'SELECT Id, lat, lng, DATE_FORMAT(nxt_inspection_dt, "%Y-%m-%d") AS nxt_inspection_dt, icon_url_a, icon_url_b, active FROM project WHERE active = 1',
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch map projects" },
      { status: 500 },
    )
  }
}
