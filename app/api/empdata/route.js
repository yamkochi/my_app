import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

// Handle GET requests
export async function GET() {
  try {
    const [response] = await pool.query(
      "SELECT e.id,r.role_name,e.name,e.email   FROM employee e, role r where  e.role_id=r.id ",
    )
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// Handle POST requests
export async function POST(request) {
  "use client"
  // console.log("i am inside  post function")
  const body = await request.json()
  //const [response] = await pool.query("INSERT INTO FRIENDS values")
  const [result] = await pool.execute(
    "INSERT INTO employee (name) VALUES (?)",
    [body.name],
  )

  return NextResponse.json(
    {
      message: "Data inserted",
      id: result.insertId,
      data: body.name,
    },
    // console.log(body.name),
  )
}

// Handle POST requests
export async function PUT(request) {
  "use client"
  // console.log("i am inside  post function")
  const body = await request.json()
  //const [response] = await pool.query("INSERT INTO FRIENDS values")
  const [result] = await pool.execute(
    "INSERT INTO employee (name) VALUES (?)",
    [body.name],
  )

  return NextResponse.json(
    {
      message: "Data inserted",
      id: result.insertId,
      data: body.name,
    },
    // console.log(body.name),
  )
}
