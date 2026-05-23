// app/layout.js
import "./globals.css" // 1. Run Tailwind v4 foundations first
import "leaflet/dist/leaflet.css" // 2. Ov

import { getSession } from "./api/auth/session" // ✅ Named import (with curly braces)
import Navbar from "../app/components/NavBar" // ✅ Default import (NO curly braces)

export const metadata = {
  title: "Enterprise System",
}

export default async function RootLayout({ children }) {
  const session = await getSession()

  return (
    <html lang="en">
      <body>
        {/* Passing server session directly to the Navbar */}
        <Navbar initialUser={session} />
        {children}
      </body>
    </html>
  )
}
