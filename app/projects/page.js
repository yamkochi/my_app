"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import map component to avoid Next.js SSR errors for Leaflet
const MapModal = dynamic(() => import("../components/map/MapModel"), {
  ssr: false,
  loading: () => <p className="text-center p-4">Loading Map...</p>,
})

export default function MasterDetailForm() {
  const router = useRouter()

  // State Management
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])

  // Form States
  const [projectForm, setProjectForm] = useState(getInitialProjectState())
  const [teamForm, setTeamForm] = useState(getInitialTeamState())
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [isEditingTeam, setIsEditingTeam] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)

  function getInitialProjectState() {
    return {
      id: "",
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      nxt_inspection_dt: "",
      team_head: "",
      location: "",
      address: "",
      lat: "",
      lng: "",
      icon_url_a: "",
      icon_url_b: "",
    }
  }
  function getInitialTeamState() {
    return {
      empId: "",
      dateFm: "",
      dateTo: "",
      task_allotted: "",
      adlInfo: "",
      gradeAwarded: "",
    }
  }

  // Fetch initial master project data and employee configuration list
  const fetchInitialData = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/projects")
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setProjects(data.projects || [])
      setEmployees(data.employees || [])
    } catch (err) {
      alert(`Error loading records: ${err.message}`)
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  // Fetch detail team records upon selecting a project from the left pane
  const handleSelectProject = async (project) => {
    setSelectedProject(project)
    // Format dates to string YYYY-MM-DD for standard HTML input elements
    setProjectForm({
      ...project,
      start_date: project.start_date ? project.start_date.substring(0, 10) : "",
      end_date: project.end_date ? project.end_date.substring(0, 10) : "",
      nxt_inspection_dt: project.nxt_inspection_dt
        ? project.nxt_inspection_dt.substring(0, 10)
        : "",
    })
    setIsEditingProject(true)
    resetTeamForm()
    await fetchTeamMembers(project.id)
  }

  const fetchTeamMembers = async (projectId) => {
    try {
      const res = await fetch(`/api/team?projectId=${projectId}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setTeamMembers(data || [])
    } catch (err) {
      alert(`Error loading team: ${err.message}`)
    }
  }

  const resetProjectForm = () => {
    setProjectForm(getInitialProjectState())
    setIsEditingProject(false)
    setSelectedProject(null)
    setTeamMembers([])
    resetTeamForm()
  }

  const resetTeamForm = () => {
    setTeamForm(getInitialTeamState())
    setIsEditingTeam(false)
  }

  // Master (Project) CRUD operations mapping to API
  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    const method = isEditingProject ? "PUT" : "POST"

    try {
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      alert(
        isEditingProject
          ? "Project updated successfully."
          : "Project registered successfully.",
      )
      await fetchInitialData()
      resetProjectForm()
    } catch (err) {
      alert(`Operation failed: ${err.message}`)
    }
  }

  const handleProjectDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this project and all team assignments?",
      )
    )
      return
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      alert("Project removed successfully.")
      await fetchInitialData()
      if (selectedProject?.id === id) resetProjectForm()
    } catch (err) {
      alert(`Delete failed: ${err.message}`)
    }
  }

  // Detail (Project Team) CRUD operations mapping to API
  const handleTeamSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProject) return alert("Please select a project context.")

    const method = isEditingTeam ? "PUT" : "POST"
    const payload = { ...teamForm, projectId: selectedProject.id }

    try {
      const res = await fetch("/api/team", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      alert(isEditingTeam ? "Assignment updated." : "Member deployed to team.")
      await fetchTeamMembers(selectedProject.id)
      resetTeamForm()
    } catch (err) {
      alert(`Assignment failed: ${err.message}`)
    }
  }

  const handleTeamEdit = (member) => {
    setTeamForm({
      ...member,
      dateFm: member.dateFm ? member.dateFm.substring(0, 10) : "",
      dateTo: member.dateTo ? member.dateTo.substring(0, 10) : "",
    })
    setIsEditingTeam(true)
  }

  const handleTeamDelete = async (empId) => {
    if (!confirm("Remove this employee from the project team?")) return
    try {
      const res = await fetch(
        `/api/team?projectId=${selectedProject.id}&empId=${empId}`,
        { method: "DELETE" },
      )
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      alert("Member unassigned successfully.")
      await fetchTeamMembers(selectedProject.id)
      resetTeamForm()
    } catch (err) {
      alert(`Removal failed: ${err.message}`)
    }
  }

  // Map Location Click Handler
  const handleLocationSelect = (coords) => {
    if (
      confirm(
        `Confirm mapping to coordinates Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}?`,
      )
    ) {
      setProjectForm((prev) => ({
        ...prev,
        lat: Math.round(coords.lat),
        lng: Math.round(coords.lng),
      }))
      setIsMapOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Structural Header Action Bar */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
        <h1 className="text-xl font-bold text-gray-800">
          Project Master-Detail Workplace
        </h1>
        <button
          onClick={() => router.push("/home")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
        >
          Exit to Home
        </button>
      </div>

      {/* Synchronized Columns Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COMPONENT: Projects Registry Index */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Project Directory (Master)
              </h2>
              <button
                onClick={resetProjectForm}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
            <div className="divide-y divide-gray-200 max-h-48 overflow-y-auto border rounded">
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className={`p-3 flex justify-between items-center cursor-pointer transition ${selectedProject?.id === p.id ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-gray-50"}`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.location || "No Location"} | ID: {p.id}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleProjectDelete(p.id)
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold p-1"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-xs p-4 text-gray-400">
                  No project records found.
                </p>
              )}
            </div>
          </div>

          {/* Project Input Form */}
          <form
            onSubmit={handleProjectSubmit}
            className="bg-white p-5 rounded shadow space-y-4"
          >
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
              {isEditingProject
                ? "Modify Project Attributes"
                : "Open New Project Profile"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600">
                  Project Name *
                </label>
                <input
                  required
                  type="text"
                  className="w-full text-sm border p-2 rounded"
                  value={projectForm.name}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, name: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  rows="2"
                  className="w-full text-sm border p-2 rounded"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full text-sm border p-2 rounded"
                  value={projectForm.start_date}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      start_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full text-sm border p-2 rounded"
                  value={projectForm.end_date}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, end_date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Next Inspection
                </label>
                <input
                  type="date"
                  className="w-full text-sm border p-2 rounded"
                  value={projectForm.nxt_inspection_dt}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      nxt_inspection_dt: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Team Head (Employee Dropdown)
                </label>
                <select
                  className="w-full text-sm border p-2 rounded bg-white"
                  value={projectForm.team_head}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      team_head: e.target.value,
                    })
                  }
                >
                  <option value="">-- Choose Head --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Location Tag
                </label>
                <input
                  type="text"
                  className="w-full text-sm border p-2 rounded"
                  value={projectForm.location}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, location: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full text-sm border p-2 rounded"
                  value={projectForm.address}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, address: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Latitude (Integer)
                  </label>
                  <input
                    readOnly
                    placeholder="Select via map"
                    type="number"
                    className="w-full text-sm border bg-gray-50 p-2 rounded"
                    value={projectForm.lat}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Longitude (Integer)
                  </label>
                  <input
                    readOnly
                    placeholder="Select via map"
                    type="number"
                    className="w-full text-sm border bg-gray-50 p-2 rounded"
                    value={projectForm.lng}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="bg-emerald-600 text-white text-sm px-4 py-2 rounded hover:bg-emerald-700 h-10 font-medium"
                >
                  Map
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetProjectForm}
                className="border text-sm px-4 py-2 rounded hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white text-sm px-5 py-2 rounded hover:bg-blue-700 font-medium"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COMPONENT: Team Deployments Detail Matrix */}
        <div className="space-y-6">
          {selectedProject ? (
            <>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Team Assignments: {selectedProject.name}
                </h2>
                <div className="overflow-x-auto border rounded">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-2">Employee Name</th>
                        <th className="p-2">Task</th>
                        <th className="p-2">Grade</th>
                        <th className="p-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {teamMembers.map((member, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2 font-medium">
                            {employees.find(
                              (e) => e.id === Number(member.empId),
                            )?.name || `ID: ${member.empId}`}
                          </td>
                          <td className="p-2 text-gray-600 text-xs">
                            {member.task_allotted || "None"}
                          </td>
                          <td className="p-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-bold">
                              {member.gradeAwarded || "-"}
                            </span>
                          </td>
                          <td className="p-2 text-right space-x-2">
                            <button
                              onClick={() => handleTeamEdit(member)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleTeamDelete(member.empId)}
                              className="text-red-600 hover:text-red-800 text-xs font-semibold"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      {teamMembers.length === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="p-4 text-center text-gray-400 text-xs"
                          >
                            No personnel deployed to this project team yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team Assignment Operational Form */}
              <form
                onSubmit={handleTeamSubmit}
                className="bg-white p-5 rounded shadow space-y-4"
              >
                <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
                  {isEditingTeam
                    ? "Edit Selected Assignment"
                    : "Assign Employee to Team"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Employee Selection *
                    </label>
                    <select
                      required
                      disabled={isEditingTeam} // Disable key field updates during edits
                      className="w-full text-sm border p-2 rounded bg-white disabled:bg-gray-100 text-gray-900"
                      value={teamForm.empId}
                      onChange={(e) =>
                        setTeamForm({ ...teamForm, empId: e.target.value })
                      }
                    >
                      <option value="">
                        -- Choose Employee (Stores ID) --
                      </option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Assigned From
                    </label>
                    <input
                      type="date"
                      className="w-full text-sm border p-2 rounded"
                      value={teamForm.dateFm}
                      onChange={(e) =>
                        setTeamForm({ ...teamForm, dateFm: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Assigned To
                    </label>
                    <input
                      type="date"
                      className="w-full text-sm border p-2 rounded"
                      value={teamForm.dateTo}
                      onChange={(e) =>
                        setTeamForm({ ...teamForm, dateTo: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Task Allotted
                    </label>
                    <textarea
                      rows="2"
                      className="w-full text-sm border p-2 rounded"
                      value={teamForm.task_allotted}
                      onChange={(e) =>
                        setTeamForm({
                          ...teamForm,
                          task_allotted: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Additional Info
                    </label>
                    <input
                      type="text"
                      className="w-full text-sm border p-2 rounded"
                      value={teamForm.adlInfo}
                      onChange={(e) =>
                        setTeamForm({ ...teamForm, adlInfo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Grade (Max 2 Chars)
                    </label>
                    <input
                      maxLength="2"
                      type="text"
                      className="w-full text-sm border p-2 rounded uppercase"
                      value={teamForm.gradeAwarded}
                      onChange={(e) =>
                        setTeamForm({
                          ...teamForm,
                          gradeAwarded: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={resetTeamForm}
                    className="border text-sm px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white text-sm px-5 py-2 rounded hover:bg-emerald-700 font-medium"
                  >
                    {isEditingTeam ? "Update Parameters" : "Deploy Member"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed rounded-lg p-12 text-center text-gray-400 flex flex-col items-center justify-center h-64">
              <p className="text-base font-medium">No Master Record Context</p>
              <p className="text-xs mt-1">
                Please pick a project profile from the list to manage active
                team matrices.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Leaflet Coordinates Picker Window */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl relative shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-800">Select Location Pin</h3>
              <button
                onClick={() => setIsMapOpen(false)}
                className="text-sm font-bold text-gray-500 hover:text-black"
              >
                ✕ Close
              </button>
            </div>
            <MapModal onSelectLocation={handleLocationSelect} />
          </div>
        </div>
      )}
    </div>
  )
}
