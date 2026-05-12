"use client"
import dynamic from "next/dynamic"

// Dynamically import the map component with SSR disabled
const MapWithNoSSR = dynamic(() => import("../components/Map/Map"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>, // Optional: loading state
})

export default function Page() {
  return (
    <div>
      <h1>My Map</h1>
      <MapWithNoSSR />
    </div>
  )
}
