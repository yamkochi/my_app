"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { pool } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function saveMarker(lat, lng) {
  try {
    const [result] = await pool.execute(
      "INSERT INTO markers (lat, lng) VALUES (?, ?)",
      [lat, lng],
    )
    return { success: true, id: result.insertId }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false }
  }
}

export async function deleteMarker(lat, lng) {
  await pool.execute("DELETE FROM markers WHERE lat = ? AND lng = ?", [
    lat,
    lng,
  ])
}

export async function getMarkers() {
  try {
    const [rows] = await pool.execute(
      "SELECT id, lat, lng ,icon_url FROM markers",
    )
    // Convert DECIMAL strings/numbers into the [lat, lng] format Leaflet expects
    return rows.map((row) => ({
      id: row.id,
      position: [parseFloat(row.lat), parseFloat(row.lng)],
      iconUrl: row.icon_url,
    }))
  } catch (error) {
    console.error("Fetch error:", error)
    return []
  }
}

export async function createuser(formdata) {
  "use server"
  const name = formdata.get("name")
  console.log(name)
  const res = await fetch("http://localhost:3000/api/empdata", {
    method: "POST",
    // body: name,
    body: JSON.stringify({ name }),
  })
  // console.log(res.json())
}

// export async function getEmployeeById(data) {
//   //"use server"
//   const empid = data
//   console.log("In actions ")
//   console.log(empid)

//   try {
//     const [response] = await pool.query("SELECT * from employee where id=?", [
//       empid,
//     ])
//     // return NextResponse.json(response)
//     return response
//   } catch (error) {
//     // return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })

//     console.error("Fetch error:", error)
//     return []
//   }
// }

// console.log(res.json())

export async function getAllRoles() {
  try {
    const [rows] = await pool.execute("SELECT id, role_name FROM role")

    return rows.map((row) => ({
      id: row.id,
      role_name: row.role_name,
    }))
  } catch (error) {
    console.error("Fetch error:", error)
    return []
  }
}

// import { pool } from "@/lib/db"
// import { revalidatePath } from "next/cache"

export async function updateEmployeeAction(data) {
  try {
    if (data.password) {
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password, salt)
    }
    const query = `
      UPDATE employee
      SET 
        name = ?, 
        email = ?, 
        role_id = ?, 
        role_desc = ?, 
        date_joined = ?, 
        photo_url = ?, 
        lat = ?, 
        lng = ?, 
        password = ?, 
        logtime = ?
      WHERE id = ?
    `

    const values = [
      data.name,
      data.email,
      parseInt(data.role_id),
      data.role_desc,
      data.date_joined || null,
      data.photo_url,
      parseFloat(data.lat) || 0,
      parseFloat(data.lng) || 0,
      data.password, // Ideally hashed before this step
      data.logtime || null,
      data.id,
    ]

    await pool.execute(query, values)

    // Refresh the UI cache
    revalidatePath("/employees")

    return { success: true }
  } catch (error) {
    console.error("MySQL Error:", error)
    return { success: false, error: error.message }
  }
}

export async function addEmployeeAction(data) {
  try {
    if (data.password) {
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password, salt)
    }
    const query = `
      INSERT INTO employees 
      (name, email, role_id, role_desc, date_joined, photo_url, lat, lng, password, logtime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const values = [
      data.name,
      data.email,
      parseInt(data.role_id),
      data.role_desc,
      data.date_joined || null,
      data.photo_url,
      parseFloat(data.lat) || 0,
      parseFloat(data.lng) || 0,
      data.password,
      data.logtime || null,
    ]

    await pool.execute(query, values)

    revalidatePath("/employees") // Update the list view
  } catch (error) {
    console.error("Insert Error:", error)
    return { error: "Failed to create employee" }
  }

  redirect("/employees") // Send user back to the list
}

// 1. Fetch employee joined with role data by ID
export async function getEmployeeById(empId) {
  console.log("in getempbyid")
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, r.role_name 
       FROM employee e 
       LEFT JOIN role r ON e.role_id = r.id 
       WHERE e.id = ?`,
      [empId],
    )
    return { success: true, data: rows[0] || null }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 2. Delete employee by ID
export async function deleteEmployee(empId) {
  try {
    const [result] = await pool.execute("DELETE FROM employee WHERE id = ?", [
      empId,
    ])
    return { success: result.affectedRows > 0 }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
