// app/admin/roles/EmployeeTableWrapper.js
"use client"
import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically pull Leaflet rendering popup modal with SSR disabled
const ViewLocationMapModal = dynamic(() => import("./ViewLocationMapModal"), {
  ssr: false,
})

export default function EmployeeTableWrapper({ employees }) {
  const [selectedLocation, setSelectedLocation] = useState(null)

  const handleOpenMap = (employee) => {
    if (!employee.lat || !employee.lan) {
      alert(
        `⚠️ No tracking coordinates logged on the system for ${employee.name}`,
      )
      return
    }
    setSelectedLocation({
      name: employee.name,
      lat: parseFloat(employee.lat),
      lan: parseFloat(employee.lan),
    })
  }

  return (
    <>
      {/* Scrollable table viewport canvas boundary */}
      <div className="w-full max-h-[550px] overflow-y-auto border border-gray-200 rounded-xl shadow-inner bg-gray-50 scrollbar-thin">
        <table className="w-full text-left border-collapse relative">
          {/* Sticky Header stays fixed at top of screen while scrolling records row profiles */}
          <thead className="sticky top-0 bg-gray-900 text-white text-base font-semibold uppercase tracking-wider z-20">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Security Clearance</th>
              <th className="px-6 py-4">Corporate Email</th>
              <th className="px-6 py-4 text-center">Active Projects</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-xl font-medium text-gray-800 bg-white">
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-12 text-gray-400 font-normal"
                >
                  No employee entries found inside registry index tables.
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const isAdmin = Buffer.isBuffer(emp.admin)
                  ? emp.admin.readInt8(0) === 1
                  : !!emp.admin

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-indigo-50/40 transition-colors"
                  >
                    {/* User Profile Column */}
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <img
                        src={emp.photo_url || "https://unsplash.com"}
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
                      />
                      <div>
                        <div className="font-bold text-gray-900">
                          {emp.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          UID: #{emp.id}
                        </div>
                      </div>
                    </td>

                    {/* Dynamic Role Mapping Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAdmin ? (
                        <span className="text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
                          Sys-Admin
                        </span>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                          Staff
                        </span>
                      )}
                    </td>

                    {/* Email Column */}
                    <td className="px-6 py-4 text-gray-600 font-normal truncate max-w-xs">
                      {emp.email}
                    </td>

                    {/* Project Counter Bridge Total Column */}
                    <td className="px-6 py-4 text-center font-bold">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-lg ${
                          emp.total_projects > 0
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {emp.total_projects}
                      </span>
                    </td>

                    {/* Location popup tracking launcher anchor point row */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenMap(emp)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-base transition shadow flex items-center space-x-1.5 ml-auto"
                      >
                        <span>📍 Find location</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Popover Mapping Interface Component Container */}
      {selectedLocation && (
        <ViewLocationMapModal
          locationData={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </>
  )
}
