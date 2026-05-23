"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"

// Fix for missing default Leaflet marker icons in Next.js builds
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com",
  shadowUrl: "https://unpkg.com",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function EmployeeMap({ lat, lan, onLocationSelect }) {
  // Center map on existing coordinates, or fallback to Chennai/Guindy area defaults
  const mapCenter =
    lat && lan ? [parseFloat(lat), parseFloat(lan)] : [13.0067, 80.2206]

  // Component to catch user click events on the map framework
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6))
      },
    })
    return null
  }

  return (
    <div
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "6px",
        overflow: "hidden",
        border: "1px solid #ccc",
        margin: "10px 0",
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat && lan && (
          <Marker
            position={[parseFloat(lat), parseFloat(lan)]}
            icon={defaultIcon}
          />
        )}
        <MapClickHandler />
      </MapContainer>
    </div>
  )
}
