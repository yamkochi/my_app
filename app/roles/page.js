import { getRoles } from "../actions/roles"
import RoleList from "../components/RoleLists"
import RoleForm from "../components/RoleForm"

export const dynamic = "force-dynamic"

export default async function RolesPage() {
  const result = await getRoles()

  if (!result.success) {
    return (
      <div className="p-6 text-red-500">
        Error loading roles: {result.error}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Role Management</h1>
      <RoleForm />
      <RoleList initialRoles={result.data} />
    </div>
  )
}
