// app/dashboard/profile/ProfileForm.js
"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const LocationMapModal = dynamic(() => import("./LocationMapModal"), {
  ssr: false,
})

export default function ProfileForm({ initialData }) {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [name, setName] = useState(initialData.name || "")
  const [photoUrl, setPhotoUrl] = useState(initialData.photo_url || "")
  const [lat, setLat] = useState(initialData.lat || "")
  const [lan, setLan] = useState(initialData.lan || "")
  const [password, setPassword] = useState("")

  // State to track password visibility toggle
  const [showPassword, setShowPassword] = useState(false)

  const [isMapOpen, setIsMapOpen] = useState(false)
  const [status, setStatus] = useState({ type: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // ✅ FIXED: Re-included the full missing file upload handler function
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setStatus({ type: "", message: "" })

    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("/api/auth/profile/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setPhotoUrl(data.photo_url)
        setStatus({
          type: "success",
          message: "Photo captured and uploaded successfully!",
        })
        router.refresh() // Sync navbar profile asset instantly
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to upload photo.",
        })
      }
    } catch {
      setStatus({
        type: "error",
        message: "Connection error while transferring file asset.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: "", message: "" })

    try {
      const res = await fetch("/api/auth/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photo_url: photoUrl, lat, lan, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Profile information updated successfully!",
        })
        setPassword("") // Wipe password string from client state memory for safety reasons
        router.refresh()
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to update fields.",
        })
      }
    } catch {
      setStatus({
        type: "error",
        message: "An unexpected connection error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateCoordinates = (selectedLat, selectedLan) => {
    setLat(selectedLat)
    setLan(selectedLan)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {status.message && (
          <div
            className={`p-4 rounded-xl text-base font-semibold ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.type === "success" ? "✅ " : "❌ "} {status.message}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-medium text-gray-800 bg-gray-50 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Profile Photo Control
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-center space-x-4">
            <div
              onClick={() => fileInputRef.current.click()}
              className="flex-1 px-4 py-3 border rounded-xl text-xl text-gray-500 bg-gray-50 cursor-pointer hover:bg-gray-100 transition truncate font-mono select-none"
            >
              {photoUrl || "Click here to take a photo or select file..."}
            </div>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-lg transition tracking-wide shrink-0 shadow"
            >
              {isUploading ? "Processing..." : "📸 Browse/Camera"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Change Password (Leave blank to keep unchanged)
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-14 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-medium text-gray-800 bg-gray-50 transition"
              placeholder="•••••••• (Enter at least 6 characters)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-400 hover:text-indigo-600 font-bold transition focus:outline-none p-1"
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Latitude (lat)
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl text-xl text-gray-800 bg-gray-50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Longitude (lan)
            </label>
            <input
              type="number"
              step="any"
              value={lan}
              onChange={(e) => setLan(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl text-xl text-gray-800 bg-gray-50 outline-none"
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xl transition shadow flex items-center justify-center space-x-2"
          >
            📍 <span>Map-your-location</span>
          </button>
        </div>

        <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
          <a
            href="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-xl transition text-xl"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-8 py-3 rounded-xl transition text-xl shadow"
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      <LocationMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        currentLat={lat}
        currentLan={lan}
        onSaveCoordinates={updateCoordinates}
      />
    </>
  )
}
