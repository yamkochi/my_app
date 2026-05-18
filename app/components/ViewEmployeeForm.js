"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getEmployeeById, deleteEmployee } from "@/app/actions/employees"
import {
  Trash2,
  User,
  MapPin,
  Calendar,
  Clock,
  Loader2,
  LogOut,
} from "lucide-react"
import Link from "next/link"
const ViewEmployeeForm = ({ empId }) => {
  const router = useRouter()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch record on mount or when empId changes
  useEffect(() => {
    if (!empId) return
    //  console.log(empId)
    //  console.log("in view emp form")
    async function loadData() {
      setLoading(true)
      const res = await getEmployeeById(empId)
      if (res.success && res.data) {
        setEmployee(res.data)
      } else {
        alert("Employee record not found or error loading data.")
      }
      setLoading(false)
    }

    loadData()
  }, [empId])

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${employee?.name || "this record"}?`,
    )
    if (!confirmDelete) return

    setIsDeleting(true)
    try {
      const response = await deleteEmployee(empId)

      if (response.success) {
        alert("Employee record deleted successfully!")
        setTimeout(() => {
          router.push("/employee")
        }, 2000)
      } else {
        alert("Failed to delete the record.")
        setIsDeleting(false)
      }
    } catch (error) {
      alert("An error occurred during deletion.")
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Retrieving database records...</p>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="text-center p-8 text-red-500">
        No profile found matching ID: {empId}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
          <User /> Employee Profile
        </h2>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
          ID: {employee.id}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            readOnly
            value={employee.name || ""}
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            readOnly
            value={employee.email || ""}
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Dynamic Role from Foreign Key Join */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Assigned Role
          </label>
          <input
            readOnly
            value={employee.role_name || `ID: ${employee.role_id}`}
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Role Description */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Role Description
          </label>
          <input
            readOnly
            value={employee.role_desc || ""}
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Date Joined */}
        <div>
          <label className="md:flex text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar size={14} /> Date Joined
          </label>
          <input
            readOnly
            value={
              employee.date_joined
                ? new Date(employee.date_joined).toISOString().split("T")[0]
                : ""
            }
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Log Time */}
        <div>
          <label className="md:flex text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock size={14} /> Last Logged Time
          </label>
          <input
            readOnly
            value={employee.logtime || ""}
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Photo URL */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Photo Reference Path
          </label>
          <input
            readOnly
            value={employee.photo_url || `/empimage/${employee.id}.png`}
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed font-mono text-sm"
          />
        </div>

        {/* Coordinates */}
        <div>
          <label className="md:flex text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin size={14} /> Latitude
          </label>
          <input
            readOnly
            value={employee.lat || ""}
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="md:flex text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin size={14} /> Longitude
          </label>
          <input
            readOnly
            value={employee.lng || ""}
            className="w-full border p-2 rounded bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Trigger Delete Action */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="md:col-span-2 bg-red-600 text-white p-3 rounded-lg font-bold flex justify-center items-center gap-2 mt-6 hover:bg-red-700 disabled:bg-gray-400 transition cursor-pointer"
        >
          <Trash2 size={20} />{" "}
          {isDeleting ? "Deleting Record..." : "Delete Employee Record"}
        </button>

        <Link
          href={`/employee/`}
          className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold flex not-first:
          
          justify-center items-center px-5 py-2 rounded-md shadow-sm transition"
        >
          <LogOut size={20} />
          <span>Exit</span>
        </Link>
        {/* router.refresh()
      router.push("/employee") */}
      </div>
    </div>
  )
}

export default ViewEmployeeForm
