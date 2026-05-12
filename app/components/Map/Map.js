"use client"
import { useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import { saveMarker, deleteMarker } from "@/app/actions/employees"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Function to create a custom Leaflet icon
const createCustomIcon = (url) => {
  return new L.Icon({
    iconUrl: url || "/default-marker.png", // Fallback if null
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -40],
    className: "rounded-full border-2 border-white shadow-lg", // Optional: use CSS to style it
  })
}

/*  code to add marker to db   */
const MyMap = ({ initialMarkers }) => {
  const [markers, setMarkers] = useState(initialMarkers || [])

  function MapEvents() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng

        // 1. Save to MySQL
        const response = await saveMarker(lat, lng)

        // 2. Update UI state if DB save was successful
        if (response.success) {
          setMarkers((prev) => [
            ...prev,
            { id: response.id, position: [lat, lng] },
          ])
        }
      },
    })
    return null
  }

  const handleRemove = async (marker) => {
    const [lat, lng] = marker.position
    // 1. Remove from MySQL
    await deleteMarker(lat, lng)
    // 2. Update UI
    setMarkers((prev) => prev.filter((m) => m.id !== marker.id))
  }
  /*  code to add marker to db   */

  //function MyMap() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <MapEvents />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={createCustomIcon(marker.iconUrl)}
          eventHandlers={{ click: () => handleRemove(marker) }}
        />
      ))}

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}

export default MyMap
