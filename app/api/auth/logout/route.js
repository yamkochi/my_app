// app/api/auth/logout/route.js
import { deleteSession } from "../session"

export async function POST() {
  await deleteSession()
  return Response.json({ success: true })
}
