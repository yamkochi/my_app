import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  // console.log("inside employee db route aaaa")
  try {
    // console.log("inside employee db route")
    const [rows] = await pool.query("SELECT * FROM employee")
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
