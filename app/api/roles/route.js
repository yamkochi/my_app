import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// Handle GET requests
export async function GET() {
  try {
    const [response] = await pool.query("SELECT id,role_name FROM  role ")
    // console.log(response)
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch fdfdata" },
      { status: 500 },
    )
  }
}
