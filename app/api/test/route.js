import { NextResponse } from "next/server"

// Handle GET requests
export async function GET() {
  return NextResponse.json({ message: "Hello from the API!" })
}

// Handle POST requests
export async function POST(request) {
  const body = await request.json()
  return NextResponse.json({
    message: "Data received",
    data: body,
  })
}
