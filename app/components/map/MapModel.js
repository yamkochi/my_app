"use client"

import React from "react"
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Re-configure standard marker icon hooks to point directly to raw open-source hosting
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://cloudflare.com",
  iconRetinaUrl: "https://cloudflare.com",
  shadowUrl: "https://cloudflare.com",
})

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

export default function MapModal({ onSelectLocation }) {
  return (
    <div className="h-96 w-full rounded overflow-hidden border">
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={onSelectLocation} />
      </MapContainer>
    </div>
  )
}
