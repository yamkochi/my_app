import { pool } from "@/lib/db" // 1. Imported your existing pool instance

async function getEmployees() {
  try {
    // 2. Querying directly from the pool instance (No manual creation/destruction required)
    const [rows] = await pool.execute("SELECT * FROM employee LIMIT 10")

    return { success: true, data: rows }
  } catch (error) {
    console.error("Database connection failed:", error)
    return { success: false, error: error.message }
  }
}

export default async function EmpPage() {
  const result = await getEmployees()

  // Handle connection errors visually
  if (!result.success) {
    return (
      <div style={{ padding: "20px", color: "red", fontFamily: "sans-serif" }}>
        <h1>❌ Database Connection Failed</h1>
        <p>
          <strong>Error Details:</strong> {result.error}
        </p>
        <p>Check your environment variables or MySQL server status.</p>
      </div>
    )
  }

  // Handle empty tables
  if (result.data.length === 0) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h1>🟢 Connection Successful!</h1>
        <p>
          Connected to MySQL, but the <code>employee</code> table is currently
          empty.
        </p>
      </div>
    )
  }

  // Dynamically extract column headers from the first record
  const columns = Object.keys(result.data[0])

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🟢 Connection Successful!</h1>
      <p>
        Displaying up to 10 records from the <code>employee</code> table:
      </p>

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse", marginTop: "20px", width: "100%" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.data.map((emp, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}>
                  {/* Safely convert any binary buffer data (like your admin column) to string */}
                  {Buffer.isBuffer(emp[col])
                    ? String(emp[col].readInt8(0))
                    : String(emp[col] ?? "NULL")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
