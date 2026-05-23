// app/api/employees/locations/route.js
import { pool } from "@/lib/db"

export async function GET() {
  try {
    // Select map critical dataset vectors safely
    const [rows] = await pool.execute(
      "SELECT id, name, lat, lan, photo_url FROM employee WHERE lat IS NOT NULL AND lan IS NOT NULL",
    )

    // Ensure floating numbers are properly formatted
    const employees = rows.map((emp) => ({
      id: emp.id,
      name: emp.name,
      lat: parseFloat(emp.lat),
      lng: parseFloat(emp.lan), // Mapping 'lan' column alias to standard Leaflet 'lng' map key
      photo_url: emp.photo_url || "https://unsplash.com",
    }))

    return Response.json({ success: true, employees })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
