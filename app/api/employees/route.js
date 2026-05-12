import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function POST(request) {
  "use client"
  console.log("i am inside  post function")
  const body = await request.json()
  //const [response] = await pool.query("INSERT INTO FRIENDS values")
  const [result] = await pool.execute(
    "INSERT INTO employee (name,role_id,email,role_desc,date_joined,password,photo_url,lat,lng,logtime) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      body.name,
      body.role_id,
      body.email,
      body.role_desc,
      body.date_joined,
      body.password,
      body.photo_url,
      body.lat,
      body.lng,
      body.logtime,
    ],
  )

  return NextResponse.json(
    {
      message: "Data inserted",
      id: result.insertId,
      data: body.name,
    },
    console.log(body.name),
  )
}
