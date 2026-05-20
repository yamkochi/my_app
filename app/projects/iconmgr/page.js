"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProjectIconManager() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Track project IDs that have unsaved changes to their active field
  const [pendingChanges, setPendingChanges] = useState(new Set())
  const [isSaving, setIsSaving] = useState(false)

  const loadProjectEntries = async () => {
    try {
      const res = await fetch("/api/projects/status")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setProjects(data)
      setPendingChanges(new Set()) // Reset changes tracking on reload
    } catch (err) {
      alert(`Error loading rows: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjectEntries()
  }, [])

  // Modify toggle state locally and mark the record as modified
  const handleToggleActiveLocal = (id, currentStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !currentStatus } : p)),
    )

    setPendingChanges((prev) => {
      const updated = new Set(prev)
      if (updated.has(id)) {
        // If toggled back to original state, remove from pending tracking
        updated.delete(id)
      } else {
        updated.add(id)
      }
      return updated
    })
  }

  // Save all modified active fields to the database table
  const handleSaveChanges = async () => {
    if (pendingChanges.size === 0) {
      alert("No modifications found to save.")
      return
    }

    setIsSaving(true)
    try {
      // Filter out only the projects that were modified
      const modifiedProjects = projects.filter((p) => pendingChanges.has(p.id))

      // Send updates to the API handler
      const res = await fetch("/api/projects/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: modifiedProjects }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      alert("Active states updated successfully in database.")
      setPendingChanges(new Set()) // Clear tracking list
    } catch (err) {
      alert(`Failed to save modifications: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileChange = async (e, projectId, fieldType) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== "image/png") {
      alert("Invalid assignment: Please select a valid .png image file.")
      return
    }

    const formData = new FormData()
    formData.append("id", projectId)
    formData.append("fieldType", fieldType)
    formData.append("file", file)

    try {
      const userSessionToken =
        localStorage.getItem("authToken") || "your-secure-app-token"
      const res = await fetch("/api/projects/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${userSessionToken}` },
        body: formData,
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      alert("Icon uploaded and directory pointer synchronized.")
      loadProjectEntries()
    } catch (err) {
      alert(`Upload failed: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Upper Control Bar Layout */}
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white p-5 rounded-xl shadow-sm mb-6 border">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Project Asset & Status Configuration
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Toggle active statuses and save your modifications to the database
            table
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveChanges}
            disabled={pendingChanges.size === 0 || isSaving}
            className={`font-medium text-sm px-5 py-2.5 rounded-lg transition shadow-sm ${
              pendingChanges.size > 0 && !isSaving
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Saving..." : `Save Changes (${pendingChanges.size})`}
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-slate-700 hover:bg-slate-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition shadow-sm"
          >
            Exit to Home
          </button>
        </div>
      </div>

      {/* Main Registry Presentation Element */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-sm text-gray-400">
            Loading master files layout index...
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-100 text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Project Profile</th>
                <th className="p-4">Next Inspection Date</th>
                <th className="p-4">Icon Asset A Path</th>
                <th className="p-4">Icon Asset B Path</th>
                <th className="p-4 text-center">Active Status Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className={`transition ${pendingChanges.has(project.id) ? "bg-amber-50/40 hover:bg-amber-50" : "hover:bg-slate-50/50"}`}
                >
                  <td className="p-4">
                    <span className="font-semibold text-gray-900 block">
                      {project.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        ID: {project.id}
                      </span>
                      {pendingChanges.has(project.id) && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                          Unsaved Changes
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-gray-500">
                    {project.nxt_inspection_dt
                      ? project.nxt_inspection_dt.substring(0, 10)
                      : "N/A"}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-2 max-w-xs">
                      <span
                        className="text-xs font-mono bg-gray-50 p-1 rounded border text-gray-600 truncate"
                        title={project.icon_url_a}
                      >
                        {project.icon_url_a || "Not Assigned"}
                      </span>
                      <label className="w-fit bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs px-2.5 py-1.5 rounded font-medium cursor-pointer transition text-center">
                        Select PNG
                        <input
                          type="file"
                          accept=".png"
                          className="hidden"
                          onChange={(e) =>
                            handleFileChange(e, project.id, "icon_url_a")
                          }
                        />
                      </label>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-2 max-w-xs">
                      <span
                        className="text-xs font-mono bg-gray-50 p-1 rounded border text-gray-600 truncate"
                        title={project.icon_url_b}
                      >
                        {project.icon_url_b || "Not Assigned"}
                      </span>
                      <label className="w-fit bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs px-2.5 py-1.5 rounded font-medium cursor-pointer transition text-center">
                        Select PNG
                        <input
                          type="file"
                          accept=".png"
                          className="hidden"
                          onChange={(e) =>
                            handleFileChange(e, project.id, "icon_url_b")
                          }
                        />
                      </label>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleActiveLocal(project.id, project.active)
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          project.active ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            project.active ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span
                        className={`text-xs font-bold w-8 text-left ${project.active ? "text-emerald-600" : "text-gray-400"}`}
                      >
                        {project.active ? "Yes" : "No"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-400 text-xs"
                  >
                    No matching structural database row matches found inside
                    database pool directory index.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
