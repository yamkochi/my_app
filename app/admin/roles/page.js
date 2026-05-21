// app/admin/roles/page.js
import { getSession } from "@/app/api/auth/session"
import { pool } from "@/lib/db"
import { redirect } from "next/navigation"
import EmployeeTableWrapper from "./EmployeeTableWrapper"

export default async function AdminEmployeeListPage() {
  // 1. Guard route at server layer to verify Admin clearance status
  const session = await getSession()
  if (!session || !session.isAdmin) {
    redirect("/?unauthorized=true")
  }

  let employeesList = []

  try {
    // 2. Formulate aggregate group query to map profile rows alongside relational totals
    const [rows] = await pool.execute(`
      SELECT 
        e.id, 
        e.name, 
        e.email, 
        e.photo_url, 
        e.admin, 
        e.lat, 
        e.lan,
        COUNT(pt.projectid) AS total_projects
      FROM employee e
      LEFT JOIN project_team pt ON e.id = pt.empid
      GROUP BY e.id
      ORDER BY e.name ASC
    `)

    employeesList = rows
  } catch (error) {
    console.error("Database compilation error on team query:", error)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header Block Section */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Employee Registry Matrix
            </h1>
            <p className="text-xl text-gray-500 mt-1">
              Monitor staff clearances, assignments, and coordinates
            </p>
          </div>
          <span className="bg-indigo-100 text-indigo-800 text-base font-bold px-4 py-2 rounded-full">
            Total Staff: {employeesList.length}
          </span>
        </div>

        {/* 3. Pass row collection into interactive scrollable viewport component wrapper */}
        <EmployeeTableWrapper employees={employeesList} />
      </div>
    </main>
  )
}
