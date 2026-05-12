import MapLoader from "@/app/components/Map/MapLoader"
import { getMarkers } from "@/app/actions/employees"

export default async function Page() {
  // Fetch data on the server
  const initialMarkers = await getMarkers()

  return (
    <main>
      <h1>My Saved Locations</h1>
      {/* Pass markers to the client-side loader */}
      <MapLoader initialMarkers={initialMarkers} />
    </main>
  )
}
