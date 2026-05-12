import ViewEmployeeForm from "@/app/components/ViewEmployeeForm"
export default async function employeelist({ params }) {
  const { empId } = await params
  return (
    <div>
      <h2>View Employee Form</h2>
      <ViewEmployeeForm empId={empId} />
    </div>
  )
}
