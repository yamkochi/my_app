// src/components/MapPicker.jsx
"use client"
import { useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default Leaflet icon marker assets missing in build pipelines
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cloudflare.com",
  iconUrl: "https://cloudflare.com",
  shadowUrl: "https://cloudflare.com",
})

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      // Truncating coordinates to 6 decimal places for standard geographical precision
      const confirmed = window.confirm(
        `Set coordinates to Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}?`,
      )
      if (confirmed) {
        onLocationSelect(lat, lng)
      }
    },
  })
  return null
}

export default function MapPicker({
  initialLat,
  initialLng,
  onLocationSelect,
  onClose,
}) {
  const defaultPos = [initialLat || 13.0827, initialLng || 80.2707] // Defaults to Chennai region coordinates if empty

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-3xl shadow-xl flex flex-col h-[550px]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold text-gray-800">
            Click Map to Select Location Coordinates
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition text-xs"
          >
            ✕ Close Map
          </button>
        </div>
        <div className="flex-1 rounded border overflow-hidden relative z-10">
          <MapContainer
            center={defaultPos}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {initialLat && initialLng && (
              <Marker position={[initialLat, initialLng]} />
            )}
            <MapClickHandler onLocationSelect={onLocationSelect} />
          </MapContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          * Clicking anywhere inside the boundaries triggers an update
          confirmation alert.
        </p>
      </div>
    </div>
  )
}
