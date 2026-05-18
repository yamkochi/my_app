"use server"

import { revalidatePath } from "next/cache"
// Import your Mysql  connection pool instance here
import { pool } from "@/lib/db"

export async function getRoles() {
  try {
    const [rows] = await pool.query("SELECT * FROM role ORDER BY id DESC")
    return { success: true, data: rows }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function createRole(formData) {
  // console.log("in create roles......")
  const roleName = formData.get("role_name")
  if (!roleName) return { success: false, error: "Role name is required" }

  try {
    await pool.query("INSERT INTO role (role_name) VALUES (?)", [roleName])
    revalidatePath("/roles")
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateRole(id, roleName) {
  if (!roleName) return { success: false, error: "Role name is required" }

  try {
    await pool.query("UPDATE role SET role_name = ? WHERE id = ?", [
      roleName,
      id,
    ])
    revalidatePath("/roles")
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteRole(id) {
  try {
    await pool.query("DELETE FROM role WHERE id = ?", [id])
    revalidatePath("/roles")
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
