// components/EmployeeList.js
import Link from "next/link"
import { pool } from "@/lib/db"

async function getEmployees() {
  try {
    // JOIN query to get the role name via the foreign key
    const [rows] = await pool.query(`
      SELECT e.id, e.name, e.email, e.photo_url, r.role_name 
      FROM employee e
      JOIN role r ON e.role_id = r.id
    `)
    return rows
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

export default async function EmployeeList() {
  const employees = await getEmployees()

  return (
    <div className="p-10">
      {/* Header Section with Navigation Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Staff Records</h1>
        <Link
          href={`/addemployee/`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-sm transition"
        >
          Add New Employee
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Photo</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 text-center font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <img
                    // src={person.photo_url || "https://placeholder.com"}
                    src={person.photo_url || "/empimage/default.png"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                </td>
                <td className="p-4 font-medium text-gray-900">{person.name}</td>
                <td className="p-4 text-gray-700">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                    {person.role_name}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{person.email}</td>

                <td className="p-4 text-center">
                  <Link
                    href={`/viewdelete/${person.id}`}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Delete
                  </Link>
                </td>

                <td className="p-4 text-center">
                  <Link
                    href={`/employee/${person.id}`}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
