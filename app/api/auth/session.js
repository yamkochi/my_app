// app/api/auth/session.js
import { cookies } from "next/headers"

// Make sure "export" is placed directly before the function keyword
export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")
  if (!sessionCookie) return null
  try {
    return JSON.parse(atob(sessionCookie.value))
  } catch {
    return null
  }
}

export async function createSession(user) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const sessionData = JSON.stringify(user)

  const cookieStore = await cookies()
  cookieStore.set("session", btoa(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
