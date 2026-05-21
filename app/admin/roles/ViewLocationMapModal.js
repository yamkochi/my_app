// app/admin/roles/ViewLocationMapModal.js
"use client"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

import "leaflet/dist/leaflet.css"

const displayMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com",
  iconRetinaUrl: "https://unpkg.com",
  shadowUrl: "https://unpkg.com",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export default function ViewLocationMapModal({ locationData, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl p-6 relative flex flex-col h-[550px] text-gray-900 animate-fade-in">
        {/* Modal Close Action Anchor */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-3xl z-50 transition"
        >
          &times;
        </button>

        {/* Custom Header Title displays target context tracking parameters info */}
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Tracking Target Location:{" "}
          <span className="text-indigo-600">{locationData.name}</span>
        </h3>

        {/* Leaflet Mapping Window Wrapper Layer */}
        <div className="flex-1 w-full rounded-xl overflow-hidden border relative z-10 min-h-[350px]">
          <MapContainer
            center={[locationData.lat, locationData.lan]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[locationData.lat, locationData.lan]}
              icon={displayMarkerIcon}
            >
              <Popup>
                <div className="text-sm font-bold text-gray-900">
                  {locationData.name}
                </div>
                <div className="text-xs text-gray-500">
                  Coordinates: {locationData.lat}, {locationData.lan}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Footer Dismiss Area block row layout */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-lg transition shadow"
          >
            Dismiss Tracker
          </button>
        </div>
      </div>
    </div>
  )
}
