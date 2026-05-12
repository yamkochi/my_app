"use client"

import { useState } from "react"
import { updateRole, deleteRole } from "@/app/actions/roles"

export default function RoleList({ initialRoles }) {
  const [roles, setRoles] = useState(initialRoles)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")

  const handleEdit = (role) => {
    setEditingId(role.id)
    setEditName(role.role_name)
  }

  const handleSave = async (id) => {
    const res = await updateRole(id, editName)
    if (res.success) {
      setRoles(
        roles.map((r) => (r.id === id ? { ...r, role_name: editName } : r)),
      )
      setEditingId(null)
    } else {
      alert(res.error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return
    const res = await deleteRole(id)
    if (res.success) {
      setRoles(roles.filter((r) => r.id !== id))
    } else {
      alert(res.error)
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {role.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {editingId === role.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  role.role_name
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {editingId === role.id ? (
                  <>
                    <button
                      onClick={() => handleSave(role.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
