"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import the map to completely disable Next.js SSR crashes
const EmployeeMap = dynamic(() => import("@/app/components/EmployeeMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "250px",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    >
      Loading Interactive Map Canvas...
    </div>
  ),
})

export default function EditEmployeePage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  // Form Input States
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState("")
  const [roleDesc, setRoleDesc] = useState("")
  const [dateJoined, setDateJoined] = useState("")
  const [password, setPassword] = useState("")
  const [vip, setVip] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [lat, setLat] = useState("")
  const [lan, setLan] = useState("")
  const [photoFile, setPhotoFile] = useState(null)

  const [rolesList, setRolesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [distanceFromHq, setDistanceFromHq] = useState(null)

  useEffect(() => {
    if (!id) return

    fetch(`/api/employees/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server status: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (data.error) {
          alert(data.error)
          return
        }

        if (data.employee) {
          const emp = data.employee
          setDistanceFromHq(emp.distance_from_hq) // Map the new distance metric
          setName(emp.name || "")
          setEmail(emp.email || "")
          setRoleId(emp.role_id || "")
          setRoleDesc(emp.role_desc || "")
          if (emp.date_joined) setDateJoined(emp.date_joined.substring(0, 10))
          setVip(emp.vip === 1 || emp.vip === true)
          setAdmin(emp.admin === 1 || emp.admin === true)
          setLat(emp.lat || "")
          setLan(emp.lan || "")
        }
        if (data.roles) setRolesList(data.roles)
      })
      .catch((err) => {
        alert(`Failed to load employee details: ${err.message}`)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleLocationPin = (selectedLat, selectedLan) => {
    setLat(selectedLat)
    setLan(selectedLan)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("role_id", roleId)
    formData.append("role_desc", roleDesc)
    formData.append("date_joined", dateJoined)
    formData.append("vip", vip ? "true" : "false")
    formData.append("admin", admin ? "true" : "false")
    formData.append("lat", lat)
    formData.append("lan", lan)

    if (password.trim() !== "") formData.append("password", password)
    if (photoFile) formData.append("photo", photoFile)

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        alert("🎉 Employee profile updated successfully!")
        router.push("/employee")
        router.refresh()
      } else {
        alert(`Failed to save: ${data.error}`)
      }
    } catch (err) {
      alert("An unexpected network error occurred.")
    }
  }

  if (loading)
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        Loading profile records framework...
      </div>
    )

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "sans-serif",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        style={{
          color: "#4f46e5",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "10px",
          marginTop: 0,
        }}
      >
        Edit Employee Profile
      </h1>
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Full Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Email Address:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Assigned System Access Role:
          </label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Choose Access Group --</option>
            {rolesList.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Role Profile Description:
          </label>
          <textarea
            value={roleDesc}
            onChange={(e) => setRoleDesc(e.target.value)}
            rows="3"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Employment Commencement Date:
          </label>
          <input
            type="date"
            value={dateJoined}
            onChange={(e) => setDateJoined(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Update Password (Leave blank to keep current):
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Profile Picture Upload:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            style={{ width: "100%", padding: "5px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <label
            style={{
              cursor: "pointer",
              display: "flex",
              gap: "5px",
              fontWeight: "bold",
            }}
          >
            <input
              type="checkbox"
              checked={vip}
              onChange={(e) => setVip(e.target.checked)}
            />{" "}
            VIP Status
          </label>
          <label
            style={{
              cursor: "pointer",
              display: "flex",
              gap: "5px",
              fontWeight: "bold",
            }}
          >
            <input
              type="checkbox"
              checked={admin}
              onChange={(e) => setAdmin(e.target.checked)}
            />{" "}
            Admin Controls
          </label>
        </div>

        {/* INTERACTIVE GEOLOCATION MAP COMPONENT FRAME BLOCK */}
        <div>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Geolocate Field Coordinates (Click map to pin location):
          </label>
          <EmployeeMap
            lat={lat}
            lan={lan}
            onLocationSelect={handleLocationPin}
          />
          {/* Place this JSX right beneath your <EmployeeMap /> component wrapper */}
          {distanceFromHq !== null && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#eff6ff",
                borderLeft: "4px solid #3b82f6",
                borderRadius: "4px",
                color: "#1e40af",
                fontSize: "14px",
              }}
            >
              🎯 <strong>HQ Proximity:</strong> This employee is pinned{" "}
              <strong>{distanceFromHq} km</strong> away from the Head Office.
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Latitude:
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Longitude (lan):
            </label>
            <input
              type="number"
              step="any"
              value={lan}
              onChange={(e) => setLan(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Save Profile Changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/employee")}
            style={{
              padding: "12px 20px",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
