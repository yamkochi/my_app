// app/api/auth/me/route.js
import { getSession } from "../session"

export async function GET() {
  const session = await getSession()
  return Response.json({ user: session })
}
