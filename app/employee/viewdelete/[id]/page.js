"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"

export default function ViewEmployee({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const { id } = params

  const [employee, setEmployee] = useState(null)
  const [roleName, setRoleName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:3000/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
          router.push("/employee")
          return
        }

        setEmployee(data.employee)

        // Find the human-readable text corresponding to the foreign key
        const matchedRole = data.roles.find(
          (r) => r.id === data.employee.role_id,
        )
        setRoleName(matchedRole ? matchedRole.role_name : "Unknown Role")
        setLoading(false)
      })
      .catch((err) => console.error("Error loading record details:", err))
  }, [id, router])

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you absolutely sure you want to permanently delete employee: ${employee.name}?`,
    )
    if (!confirmed) return

    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        alert("Record successfully deleted.")
        router.push("/employee")
      } else {
        const errData = await res.json()
        alert(`Failed to delete record: ${errData.error || "Server error"}`)
      }
    } catch (err) {
      console.error(err)
      alert("Network failure processing deletion.")
    }
  }

  // Helper formatting tools
  const formatDate = (isoString) =>
    isoString ? isoString.split("T")[0] : "N/A"
  const formatTime = (isoString) =>
    isoString ? isoString.replace("T", " ").slice(0, 16) : "N/A"

  if (loading)
    return <div className="text-center mt-10">Fetching profile logs...</div>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {/* Header and Back Action */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
          <p className="text-xs text-gray-400">Database ID: {employee.id}</p>
        </div>
        <button
          onClick={() => router.push("/employee")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Back to Employees
        </button>
      </div>

      <div className="space-y-6">
        {/* Photo Display Field */}
        <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg">
          <img
            src={employee.photo_url || "/empimage/placeholder.png"}
            alt="Employee Profile"
            className="h-24 w-24 object-cover rounded-full border-2 border-indigo-100 shadow"
            onError={(e) => {
              e.target.src = "https://placehold.co"
            }}
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Photo Path Location
            </h3>
            <code className="text-xs text-indigo-600 font-mono block mt-1 bg-white px-2 py-1 rounded border">
              {employee.photo_url || "No resource path bound"}
            </code>
          </div>
        </div>

        {/* Text Fields Information Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">
              Email Address
            </label>
            <div className="mt-1 p-2 bg-gray-50 border rounded text-gray-700">
              {employee.email}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">
              Assigned System Role
            </label>
            <div className="mt-1 p-2 bg-gray-50 border rounded text-gray-700 font-medium">
              {roleName}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">
            Role Description
          </label>
          <div className="mt-1 p-2 bg-gray-50 border rounded text-gray-700 whitespace-pre-wrap">
            {employee.role_desc || (
              <span className="italic text-gray-400">
                No descriptive text provided
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">
              Date Joined
            </label>
            <div className="mt-1 p-2 bg-gray-50 border rounded text-gray-700">
              {formatDate(employee.date_joined)}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">
              System Log Time
            </label>
            <div className="mt-1 p-2 bg-gray-50 border rounded text-gray-700 font-mono">
              {formatTime(employee.logtime)}
            </div>
          </div>
        </div>

        {/* Coordinates Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            Location Parameters
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">Latitude:</span>
              <div className="p-1 bg-white border rounded text-sm text-gray-700 font-mono">
                {employee.lat ?? "Not set"}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Longitude:</span>
              <div className="p-1 bg-white border rounded text-sm text-gray-700 font-mono">
                {employee.lng ?? "Not set"}
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Status Indicators */}
        <div className="flex space-x-12 p-2 border-t pt-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              VIP Designation:
            </span>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full ${employee.vip ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"}`}
            >
              {employee.vip ? "YES" : "NO"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              Admin Authority:
            </span>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full ${employee.admin ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-600"}`}
            >
              {employee.admin ? "YES" : "NO"}
            </span>
          </div>
        </div>

        {/* Critical Destruction Actions */}
        <div className="pt-6 border-t flex space-x-3">
          <button
            type="button"
            onClick={() => router.push(`/employee/${id}`)}
            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded shadow transition text-center"
          >
            Edit Instead
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded shadow transition"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  )
}
