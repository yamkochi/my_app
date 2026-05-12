"use client"

import { useRef } from "react"
import { createRole } from "../actions/roles"

export default function RoleForm() {
  const formRef = useRef(null)

  const clientAction = async (formData) => {
    const res = await createRole(formData)
    if (res.success) {
      formRef.current?.reset()
    } else {
      alert(res.error)
    }
  }

  return (
    <form
      ref={formRef}
      action={clientAction}
      className="mb-6 flex gap-4 bg-white p-4 rounded-lg shadow"
    >
      <input
        type="text"
        name="role_name"
        placeholder="Enter new role name"
        required
        className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
      >
        Add Role
      </button>
    </form>
  )
}
