"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import Link from "next/link"
import L from "leaflet"

// Fix for default Leaflet marker assets missing in Next.js
import "leaflet/dist/leaflet.css"

export default function ProjectMap({ projects }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  // Filter only active projects before rendering
  const activeProjects = projects.filter(
    (p) => p.active === 1 || p.active === true,
  )

  // Helper function to generate custom Leaflet HTML icons containing both image and date text
  const createCustomIcon = (project) => {
    const inspectionDate = new Date(project.nxt_inspection_dt)
    const iconUrl =
      currentDate < inspectionDate ? project.icon_url_a : project.icon_url_b

    return L.divIcon({
      className: "custom-project-marker",
      html: `
      <div class="flex flex-col items-center justify-center font-sans">
        <!-- Kept text compact for smaller layout context -->
        <div class="bg-slate-900 text-white text-[9px] font-semibold px-1 py-0.5 rounded shadow-sm border border-slate-700 whitespace-nowrap mb-0.5">
          ${project.nxt_inspection_dt}
        </div>
        <!-- Reduced from w-8 h-8 (32px) down to w-5 h-5 (20px) -->
        <img src="${iconUrl}" class="w-5 h-5 object-contain drop-shadow-sm" alt="Marker" onerror="this.src='https://unpkg.com';"/>
      </div>
    `,
      // Match these pixel dimensions to your combined text + image box footprint
      iconSize: [50, 40], // [Width, Height] of the total HTML wrapper layout area
      iconAnchor: [25, 40], // Point of the icon which corresponds to marker's location [Horizontal Center, Bottom]
    })
  }

  return (
    <div className="relative w-full h-screen bg-slate-50 p-4">
      {/* Top Floating Action Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center justify-between w-[calc(100%-2rem)] md:w-auto bg-white p-3 rounded-xl shadow-lg border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-800">
            Project Inspection Map
          </h1>
          <p className="text-xs text-slate-500">Showing active projects only</p>
        </div>
        <Link
          // href="http://localhost:3000/"

          href="/"
          className="ml-6 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-200 flex items-center"
        >
          Exit Map
        </Link>
      </div>

      {/* Leaflet Map Wrapper */}
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {activeProjects.map((project) => (
            <Marker
              key={project.Id}
              position={[parseFloat(project.lat), parseFloat(project.lng)]}
              icon={createCustomIcon(project)}
            >
              <Popup>
                <div className="p-1 text-sm font-sans">
                  <p className="font-bold text-slate-800">
                    Project ID: {project.Id}
                  </p>
                  <p className="text-slate-600 mt-1">
                    Next Inspection: {project.nxt_inspection_dt}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
