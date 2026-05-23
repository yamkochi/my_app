// components/AllEmployeesMap.js
"use client"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Helper component to auto-focus the camera framing around all active employees
function MapBoundsController({ employees }) {
  const map = useMap()
  useEffect(() => {
    if (employees.length > 0) {
      const bounds = L.latLngBounds(employees.map((emp) => [emp.lat, emp.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [employees, map])
  return null
}

export default function AllEmployeesMap() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/api/employees/locations")
        const data = await res.json()
        if (data.success) setEmployees(data.employees)
      } catch (err) {
        console.error("Failed to fetch workforce locations:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  // Injects custom circular HTML inside Leaflet markers via Tailwind CSS
  const createCustomMarkerIcon = (photoUrl, name) => {
    return L.divIcon({
      className: "custom-employee-marker",
      html: `
        <div class="flex flex-col items-center group relative">
          <!-- Hover Label -->
          <div class="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded shadow-md whitespace-nowrap absolute -top-8 border border-slate-700 pointer-events-none transition-transform scale-100">
            ${name}
          </div>
          <!-- Avatar Frame -->
          <div class="w-12 h-12 rounded-full border-4 border-indigo-500 bg-white shadow-xl overflow-hidden flex items-center justify-center transition-transform transform hover:scale-110 hover:border-emerald-500">
            <img src="${photoUrl}" alt="${name}" class="w-full h-full object-cover" onError="this.src='https://unsplash.com'"/>
          </div>
          <!-- Pointer Tip -->
          <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-indigo-500 -mt-[2px]"></div>
        </div>
      `,
      iconSize: [48, 56],
      iconAnchor: [24, 56],
      popupAnchor: [0, -48],
    })
  }

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-semibold">
            Plotting employee dashboard positions...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative z-10">
      <>
        <link
          rel="stylesheet"
          href="https://unpkg.com"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        <MapContainer
          center={[13.0067, 80.2206]} // Guindy default fallback center point
          zoom={5}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {employees.map((emp) => (
            <Marker
              key={emp.id}
              position={[emp.lat, emp.lng]}
              icon={createCustomMarkerIcon(emp.photo_url, emp.name)}
            >
              <Popup>
                <div className="p-1 text-center min-w-[120px]">
                  <img
                    src={emp.photo_url}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full mx-auto mb-1 object-cover border border-indigo-500"
                  />
                  <h4 className="font-bold text-sm text-slate-900">
                    {emp.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Lat: {emp.lat.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Lng: {emp.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapBoundsController employees={employees} />
        </MapContainer>
      </>
    </div>
  )
}
