"use client"
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import bcrypt from "bcryptjs"
import { Camera, Save, UserPlus } from "lucide-react"

const AddEmployeeForm = () => {
  const router = useRouter()
  const [roles, setRoles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date_joined: new Date().toISOString().split("T")[0],
      logtime: new Date().toISOString().slice(0, 19).replace("T", " "),
    },
  })

  // 1. Fetch roles for the dropdown
  useEffect(() => {
    // const data = await fetch("http://localhost:3000/api/friendsdb", {
    //     method: "GET",
    //   })

    fetch(`/api/roles`, {
      method: "GET",
    }) // Replace with your actual API endpoint
      .then((res) => res.json())
      .then((data) => setRoles(data))
  }, [])

  // 2. Handle local file selection for photo_url
  const handlePhotoClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // In a real app, you'd upload this to a server.
        // Here we simulate updating the path as requested.
        const path = `/empimage/${file.name}`
        setValue("photo_url", path)
        setSelectedFile(file.name)
      }
    }
    input.click()
  }

  // 3. Form Submission
  const onSubmit = async (data) => {
    try {
      // Encrypt password
      const salt = bcrypt.genSaltSync(10)
      data.password = bcrypt.hashSync(data.password, salt)

      const response = await fetch(`/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert("Employee added successfully!")
        // 2-second delay before navigating to the Employee page
        setTimeout(() => {
          router.push("/employee")
        }, 2000)
      }
    } catch (error) {
      console.error("Submission failed", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 text-gray-800">
        <UserPlus /> Add New Employee
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Role ID (Foreign Key) */}
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            {...register("role_id")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Description */}
        <div>
          <label className="block text-sm font-medium">Role Description</label>
          <input
            {...register("role_desc")}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Date Joined */}
        <div>
          <label className="block text-sm font-medium">Date Joined</label>
          <input
            type="date"
            {...register("date_joined")}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Photo URL Selector */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Photo URL</label>
          <div className="flex gap-2">
            <input
              readOnly
              {...register("photo_url")}
              placeholder="/empimage/{id}.png"
              className="w-full border p-2 rounded bg-gray-50"
            />
            <button
              type="button"
              onClick={handlePhotoClick}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Camera size={18} /> Browse
            </button>
          </div>
        </div>

        {/* Coordinates */}
        <div>
          <label className="block text-sm font-medium">Latitude</label>
          <input
            step="any"
            type="number"
            {...register("lat")}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Longitude</label>
          <input
            step="any"
            type="number"
            {...register("lng")}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-green-600 text-white p-3 rounded-lg font-bold flex justify-center items-center gap-2 mt-4 hover:bg-green-700 transition"
        >
          <Save size={20} /> Save Record
        </button>
      </form>
    </div>
  )
}

export default AddEmployeeForm
