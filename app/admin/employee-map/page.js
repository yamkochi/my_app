// app/admin/employee-map/page.js
"use client"
import dynamic from "next/dynamic"

// Dynamically fetch and paint client-side tracking assets securely
const AllEmployeesMap = dynamic(
  () => import("@/app/components/AllEmployeesMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">
          Initializing mapping layers...
        </p>
      </div>
    ),
  },
)

export default function EmployeeMapPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. Header sits safely outside the map height restriction */}
        <header className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Employee Deployment Map
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Geospatial monitoring view showcasing the active layout locations
              of global corporate personnel.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
              Live System Sync
            </span>
          </div>
        </header>

        {/* 2. Map wrapper holds exactly 600px of isolated space */}
        <div className="w-full h-[600px] bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden relative shadow-sm">
          <AllEmployeesMap />
        </div>
      </div>
    </main>
  )
}
