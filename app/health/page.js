"use client"

import { useState } from "react"
import Spinner from "@/app/components/Spinner" // 1. Import the spinner component

export default function HealthDashboard() {
  const [environment, setEnvironment] = useState("development")
  const [secret, setSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleCheckHealth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    const baseUrl =
      environment === "production"
        ? "https://yamkochi.com"
        : "http://localhost:3000"

    try {
      const response = await fetch(
        `${baseUrl}/api/health?secret=${encodeURIComponent(secret)}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          color: "#4f46e5",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "10px",
        }}
      >
        Infrastructure Health Check
      </h1>

      <form
        onSubmit={handleCheckHealth}
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
            Target Environment:
          </label>
          <div style={{ display: "flex", gap: "15px" }}>
            <label style={{ cursor: "pointer" }}>
              <input
                type="radio"
                value="development"
                checked={environment === "development"}
                onChange={(e) => setEnvironment(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              Development (Localhost)
            </label>
            <label style={{ cursor: "pointer" }}>
              <input
                type="radio"
                value="production"
                checked={environment === "production"}
                onChange={(e) => setEnvironment(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              Production (yamkochi.com)
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="secret"
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Security Token (CRON_SECRET):
          </label>
          <input
            id="secret"
            type="password"
            placeholder="Enter security secret key..."
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            backgroundColor: loading ? "#9ca3af" : "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Run Diagnostics
        </button>
      </form>

      {/* 2. SHOW SPINNER COMPONENT WHEN LOADING */}
      {loading && (
        <div style={{ marginTop: "30px" }}>
          <Spinner size="50px" color="#4f46e5" />
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: "14px",
              margin: "0",
            }}
          >
            Pinging servers, please wait...
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#fee2e2",
            borderLeft: "4px solid #ef4444",
            borderRadius: "4px",
            color: "#b91c1c",
          }}
        >
          <strong>Execution Failure:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>
            System Status Diagnostics Summary:
          </h3>
          <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
            <div
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: "6px",
                color: "#fff",
                backgroundColor:
                  result.services.database.status === "healthy"
                    ? "#10b981"
                    : "#ef4444",
              }}
            >
              <strong>MySQL Database:</strong>{" "}
              {result.services.database.status.toUpperCase()}
              {result.services.database.message && (
                <p style={{ fontSize: "12px", margin: "5px 0 0" }}>
                  {result.services.database.message}
                </p>
              )}
            </div>
            <div
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: "6px",
                color: "#fff",
                backgroundColor:
                  result.services.smtp.status === "healthy"
                    ? "#10b981"
                    : "#ef4444",
              }}
            >
              <strong>Hostinger SMTP:</strong>{" "}
              {result.services.smtp.status.toUpperCase()}
              {result.services.smtp.message && (
                <p style={{ fontSize: "12px", margin: "5px 0 0" }}>
                  {result.services.smtp.message}
                </p>
              )}
            </div>
          </div>
          <pre
            style={{
              backgroundColor: "#f3f4f6",
              padding: "15px",
              borderRadius: "6px",
              overflowX: "auto",
              fontSize: "14px",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
