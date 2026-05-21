// app/layout.js
import { getSession } from "./api/auth/session" // ✅ Named import (with curly braces)
import Navbar from "../app/components/NavBar" // ✅ Default import (NO curly braces)
import "./globals.css"

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
