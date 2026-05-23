"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NewEmployeeForm() {
  const router = useRouter()
  const [roles, setRoles] = useState([])
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    role_id: "",
    email: "",
    role_desc: "",
    date_joined: "",
    password: "",
    vip: false,
    admin: false,
    lat: "",
    lan: "",
    logtime: "",
  })
  //"http://localhost:3000/api/roles
  //  fetch("http://localhost:3000/api/roles", {
  //       method: "GET",
  //     }) // Replace with your actual API endpoint
  //       .then((res) => res.json())
  //       .then((data) => setRoles(data))

  //hkjhjhkhkhh
  useEffect(() => {
    fetch("/api/employees", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error("Failed loading roles", err))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.keys(formData).forEach((key) => data.append(key, formData[key]))

    const res = await fetch("/api/employees", {
      method: "POST",
      body: data,
    })
    if (res.ok) router.push("/employee")
    else alert("Failed to save record")
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
        <button
          onClick={() => router.push("/employee")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Back to Employees
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded border-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role_id"
              required
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded border-gray-300 bg-white"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.role_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Joined
            </label>
            <input
              type="date"
              name="date_joined"
              required
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role Description
          </label>
          <textarea
            name="role_desc"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded border-gray-300"
            rows="2"
          ></textarea>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              name="lat"
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              name="lan"
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Log Time
            </label>
            <input
              type="datetime-local"
              name="logtime"
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded border-gray-300"
            />
          </div>
        </div>

        {/* Binary Switches */}
        <div className="flex space-x-8 py-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              VIP Status
            </span>
            <button
              type="button"
              onClick={() => handleToggle("vip")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.vip ? "bg-indigo-600" : "bg-gray-200"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.vip ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className="text-sm text-gray-500">
              {formData.vip ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              Admin Privileges
            </span>
            <button
              type="button"
              onClick={() => handleToggle("admin")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.admin ? "bg-indigo-600" : "bg-gray-200"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.admin ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
            <span className="text-sm text-gray-500">
              {formData.admin ? "Yes" : "No"}
            </span>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee Photo
          </label>
          <div className="mt-2 flex items-center space-x-4">
            <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Select Profile Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-full border"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded shadow transition"
        >
          Save Employee Record
        </button>
      </form>
    </div>
  )
}
