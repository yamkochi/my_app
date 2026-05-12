"use client"

import dynamic from "next/dynamic"

// The actual dynamic import happens here in a Client Component
const Map = dynamic(() => import("@/app/components/Map/Map"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "500px", background: "#eee" }}>Loading Map...</div>
  ),
})

export default function MapLoader({ initialMarkers }) {
  return <Map initialMarkers={initialMarkers} />
}
