// app/page.js
"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [alertMessage, setAlertMessage] = useState(false)

  useEffect(() => {
    if (searchParams.get("unauthorized") === "true") {
      setAlertMessage(true)
      router.replace("/")
      const timer = setTimeout(() => setAlertMessage(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  return (
    /* ✅ FIXED: Set the bridge2.png image as a full-bleed backdrop layer using Tailwind */
    <main className="min-h-screen bg-[url('/misc/bridge2.png')] bg-cover bg-center bg-no-repeat bg-fixed p-8 relative flex flex-col items-center justify-start">
      {/* Dynamic Unauthorized Message Banner */}
      {alertMessage && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md bg-red-600 text-white font-bold text-center py-4 px-6 rounded-xl shadow-2xl animate-bounce">
          <p className="text-lg">
            ⛔ You are not authorised to access that page directly!
          </p>
        </div>
      )}

      {/* Hero Welcome Card Layer (Added white/80 backdrop blur to make text pop over background image) */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl mt-24 border border-white/20 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome to the Enterprise Systems Portal
        </h1>
        <p className="text-xl text-gray-600 mt-4 leading-relaxed max-w-2xl mx-auto">
          Secure identity verification dashboard connected directly to the
          corporate environment. Use the navigation menu above to access
          internal applications and modify your profile.
        </p>
      </div>
    </main>
  )
}
