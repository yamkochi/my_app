import EditEmployeeForm from "@/app/components/EditEmployeeForm"
import { getEmployeeById, getAllRoles } from "@/app/actions/employees"
//import { useRouter } from "next/navigation"

export default async function EditEmployeePage({ params }) {
  // const router = useRouter()
  const { id } = await params
  console.log("inside edit page")
  console.log(id)
  // const { id } = params

  // Fetch data in parallel on the server
  const [employee, roles] = await Promise.all([
    getEmployeeById(id),
    getAllRoles(),
  ])
  console.log(employee)
  if (!employee) {
    return <p>Employee not found.</p>
  }
  console.log("id page.js")
  console.log(employee.data.name)
  // function goback(event) {
  //   event.preventDefault()
  //   console.log("in side emp is page")
  //   router.refresh()
  //   router.push("/employee")
  // }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Edit Employee: {employee.data.name}
      </h1>

      <EditEmployeeForm employee={employee.data} roles={roles} />
    </div>
  )
}
