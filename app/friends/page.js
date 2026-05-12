import { pool } from "@/lib/db"

// This is a Server Component by default
export default async function EmployeePage() {
  let employees = []

  try {
    // 1. Fetch data from MySQL
    const [rows] = await pool.query("SELECT name FROM employee")
    employees = rows
  } catch (error) {
    console.error("Database Error:", error)
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee List</h1>
      {employees.length > 0 ? (
        <ul>
          {employees.map((emp, index) => (
            <li key={index}>{emp.name}</li>
          ))}
        </ul>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  )
}
