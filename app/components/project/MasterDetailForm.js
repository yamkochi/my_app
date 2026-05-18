"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Dynamically import map component to avoid Next.js SSR errors for Leaflet
import dynamic from "next/dynamic"

const MapModal = dynamic(() => import("./MapModal"), {
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
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null)
  const [isMapOpen, setIsMapOpen] = useState(false)

  // Helper Initials
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

  // API Simulation / Fetching logic
  useEffect(() => {
    // Replace with actual API fetches from your MySQL pool routes
    setEmployees([
      { id: 1, name: "Alice Smith" },
      { id: 2, name: "Bob Jones" },
      { id: 3, name: "Charlie Brown" },
    ])
    setProjects([
      {
        id: 101,
        name: "Metro Rail Phase 1",
        description: "Urban transit system expansion.",
        start_date: "2026-01-01",
        end_date: "2027-12-31",
        nxt_inspection_dt: "2026-06-01",
        team_head: 1,
        location: "Zone A",
        address: "123 Main St",
        lat: 13.0827,
        lng: 80.2707,
        icon_url_a: "",
        icon_url_b: "",
      },
    ])
  }, [])

  // Handle Project Selection
  const handleSelectProject = (project) => {
    setSelectedProject(project)
    setProjectForm(project)
    setIsEditingProject(true)
    // Fetch team members filtered by project id from your API
    setTeamMembers([
      {
        projectId: project.id,
        empId: 1,
        dateFm: "2026-01-01",
        dateTo: "2026-06-01",
        task_allotted: "Site Survey",
        adlInfo: "Lead role",
        gradeAwarded: "A",
      },
    ])
    resetTeamForm()
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
    setSelectedTeamIndex(null)
  }

  // Master (Project) CRUD operations
  const handleProjectSubmit = (e) => {
    e.preventDefault()
    if (isEditingProject) {
      setProjects(
        projects.map((p) => (p.id === projectForm.id ? projectForm : p)),
      )
      alert("Project updated successfully.")
    } else {
      const newProj = { ...projectForm, id: Date.now() } // Temporary ID generation
      setProjects([...projects, newProj])
      alert("Project added successfully.")
    }
    resetProjectForm()
  }

  const handleProjectDelete = (id) => {
    if (
      confirm("Are you sure you want to delete this project and its details?")
    ) {
      setProjects(projects.filter((p) => p.id !== id))
      if (selectedProject?.id === id) resetProjectForm()
    }
  }

  // Detail (Project Team) CRUD operations
  const handleTeamSubmit = (e) => {
    e.preventDefault()
    if (!selectedProject) return alert("Please select a project first.")

    if (isEditingTeam) {
      const updatedTeam = [...teamMembers]
      updatedTeam[selectedTeamIndex] = {
        ...teamForm,
        projectId: selectedProject.id,
      }
      setTeamMembers(updatedTeam)
    } else {
      setTeamMembers([
        ...teamMembers,
        { ...teamForm, projectId: selectedProject.id },
      ])
    }
    resetTeamForm()
  }

  const handleTeamEdit = (index) => {
    setTeamForm(teamMembers[index])
    setIsEditingTeam(true)
    setSelectedTeamIndex(index)
  }

  const handleTeamDelete = (index) => {
    if (confirm("Remove this team member?")) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index))
      resetTeamForm()
    }
  }

  // Map Location Selection Callback
  const handleLocationSelect = (coords) => {
    if (
      confirm(
        `Confirm coordinates Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}?`,
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
      {/* Top Header Panel */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
        <h1 className="text-xl font-bold text-gray-800">
          Project Workspace Management
        </h1>
        <button
          onClick={() => router.push("/home")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
        >
          Exit to Home
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Master Records & Project Form */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Project List (Master)
              </h2>
              <button
                onClick={resetProjectForm}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Add New Project
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
                      {p.location} | {p.start_date}
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
            </div>
          </div>

          {/* Project Input/Edit Form */}
          <form
            onSubmit={handleProjectSubmit}
            className="bg-white p-5 rounded shadow space-y-4"
          >
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
              {isEditingProject
                ? "Modify Project Profile"
                : "Register New Project"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Project Name
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
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600">
                  Full Address
                </label>
                <textarea
                  rows="2"
                  className="w-full text-sm border p-2 rounded"
                  value={projectForm.address}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, address: e.target.value })
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
              <div className="col-span-2 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600">
                    Latitude (Integer)
                  </label>
                  <input
                    readOnly
                    placeholder="Click map to fill"
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
                    placeholder="Click map to fill"
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

        {/* RIGHT COLUMN: Detail (Project Team Assignments) */}
        <div className="space-y-6">
          {selectedProject ? (
            <>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Team Deployment ({selectedProject.name})
                </h2>
                <div className="overflow-x-auto border rounded">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-2">Employee</th>
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
                            {member.task_allotted}
                          </td>
                          <td className="p-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-bold">
                              {member.gradeAwarded || "N/A"}
                            </span>
                          </td>
                          <td className="p-2 text-right space-x-2">
                            <button
                              onClick={() => handleTeamEdit(idx)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleTeamDelete(idx)}
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
                            No team members assigned yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team Member Form */}
              <form
                onSubmit={handleTeamSubmit}
                className="bg-white p-5 rounded shadow space-y-4"
              >
                <h3 className="text-md font-semibold text-gray-800 border-b pb-2">
                  {isEditingTeam ? "Update Assignment" : "Assign Team Member"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Select Employee
                    </label>
                    <select
                      required
                      className="w-full text-sm border p-2 rounded bg-white"
                      value={teamForm.empId}
                      onChange={(e) =>
                        setTeamForm({ ...teamForm, empId: e.target.value })
                      }
                    >
                      <option value="">-- Choose Employee --</option>
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
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Grade (Max 2 chars)
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
                    {isEditingTeam ? "Update Record" : "Add to Team"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed rounded-lg p-12 text-center text-gray-400 flex flex-col items-center justify-center h-64">
              <p className="text-base font-medium">No Project Selected</p>
              <p className="text-xs mt-1">
                Click a project from the master list on the left to review and
                manage team members.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Map Modal overlay */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
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
