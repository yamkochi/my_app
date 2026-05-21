// app/dashboard/profile/LocationMapModal.jsx
"use client"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"

// Import mandatory Leaflet baseline styles inside the browser thread context
import "leaflet/dist/leaflet.css"

// ✅ FIX 1: Fixed the broken array syntax and dimensions for custom icons
const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com",
  iconRetinaUrl: "https://unpkg.com",
  shadowUrl: "https://unpkg.com",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Embedded helper component to listen to clicks on the Leaflet map layer canvas
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      // ✅ FIX 2: Fixed spelling from e.latlng.lng to match your "lan" field mapping expectations
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocationMapModal({
  isOpen,
  onClose,
  currentLat,
  currentLan,
  onSaveCoordinates,
}) {
  const [position, setPosition] = useState(null)

  // Set initial map pin placement coordinates on modal popup mount
  useEffect(() => {
    if (currentLat && currentLan) {
      setPosition({ lat: parseFloat(currentLat), lng: parseFloat(currentLan) })
    } else {
      // Baseline center fallback map view (e.g., Central India)
      setPosition({ lat: 20.5937, lng: 78.9629 })
    }
  }, [currentLat, currentLan, isOpen])

  if (!isOpen) return null

  const handleSelect = (lat, lng) => {
    setPosition({ lat, lng })
  }

  const handleConfirm = () => {
    if (position) {
      onSaveCoordinates(position.lat.toFixed(6), position.lng.toFixed(6))
      onClose()
    }
  }

  return (
    // ✅ FIX 3: Fixed z-index layers so map pops up ON TOP of your profile forms cleanly
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl p-6 relative flex flex-col h-[600px] text-gray-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-3xl z-50"
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Click a point on the map to log your location
        </h3>

        {/* Leaflet Mapping Window Layer */}
        <div className="flex-1 w-full rounded-xl overflow-hidden border relative z-10 min-h-[350px]">
          {position && (
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onLocationSelect={handleSelect} />
              <Marker
                position={[position.lat, position.lng]}
                icon={customMarkerIcon}
              />
            </MapContainer>
          )}
        </div>

        {/* Selected Coordinates Information & Action Row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg text-gray-600 font-medium">
            Selected:{" "}
            <span className="text-indigo-600 font-bold">
              {position?.lat?.toFixed(6) || "None"}
            </span>{" "}
            ,{" "}
            <span className="text-indigo-600 font-bold">
              {position?.lng?.toFixed(6) || "None"}
            </span>
          </div>
          <div className="space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl text-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xl transition shadow"
            >
              Apply Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
