// middleware.js
import { NextResponse } from "next/server"

export function middleware(request) {
  const url = request.nextUrl
  const sessionCookie = request.cookies.get("session")

  // Allow open access to home, overview, and features pages
  if (
    url.pathname === "/" ||
    url.pathname === "/overview" ||
    url.pathname === "/features"
  ) {
    return NextResponse.next()
  }

  // Allow access to auth endpoints
  if (url.pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Protect all other pages
  if (!sessionCookie) {
    const loginUrl = new URL("/", request.url)
    loginUrl.searchParams.set("unauthorized", "true")
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
