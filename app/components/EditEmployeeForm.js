"use client"

import { useForm } from "react-hook-form"
import { updateEmployeeAction } from "@/app/actions/employees"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"

export default function EditEmployeeForm({ employee, roles }) {
  // Pass existing employee data to defaultValues for pre-filling
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...employee,
      // Format dates to YYYY-MM-DD for the HTML date input
      date_joined: employee.date_joined
        ? new Date(employee.date_joined).toISOString().split("T")[0]
        : "",
      logtime: employee.logtime
        ? new Date(employee.logtime).toISOString().slice(0, 16)
        : "",
    },
  })

  const onSubmit = async (data) => {
    //e.preventDefault()
    console.log("in side emp update form")
    console.log(data)
    const result = await updateEmployeeAction(data)
    if (result.success) {
      alert("Employee updated successfully!")

      router.refresh()
      router.push("/employee")
    }
  }

  //<form onSubmit={(e) => onSubmit(e, data)}>

  return (
    <form
      //onSubmit={handleSubmit(onSubmit)}
      onSubmit={handleSubmit(onSubmit)}
      //Submit={handleSubmit()=>{onSubmit}
      className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-lg border"
    >
      {/* Hidden ID field */}
      <input type="hidden" {...register("id")} />
      <section>
        <label className="block text-sm font-semibold">Full Name</label>

        <input
          {...register("name", { required: true })}
          className="w-full border p-2 rounded"
        />
      </section>
      <div className="grid grid-cols-2 gap-4">
        <section>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border p-2 rounded"
          />
        </section>
        <section>
          <label className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border p-2 rounded"
          />
        </section>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <section>
          <label className="block text-sm font-semibold">Role</label>
          <select
            {...register("role_id")}
            className="w-full border p-2 rounded"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </section>
        <section>
          <label className="block text-sm font-semibold">
            Role Description
          </label>
          <input
            {...register("role_desc")}
            className="w-full border p-2 rounded"
          />
        </section>
      </div>
      <section>
        <label className="block text-sm font-semibold">Photo URL</label>
        <input
          {...register("photo_url")}
          className="w-full border p-2 rounded"
          placeholder="https://..."
        />
      </section>
      <div className="grid grid-cols-2 gap-4">
        <section>
          <label className="block text-sm font-semibold">Latitude</label>
          <input
            type="number"
            step="any"
            {...register("lat")}
            className="w-full border p-2 rounded"
          />
        </section>
        <section>
          <label className="block text-sm font-semibold">Longitude</label>
          <input
            type="number"
            step="any"
            {...register("lng")}
            className="w-full border p-2 rounded"
          />
        </section>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <section>
          <label className="block text-sm font-semibold">Date Joined</label>
          <input
            type="date"
            {...register("date_joined")}
            className="w-full border p-2 rounded"
          />
        </section>
        <section>
          <label className="block text-sm font-semibold">Log Time</label>
          <input
            type="datetime-local"
            {...register("logtime")}
            className="w-full border p-2 rounded"
          />
        </section>
      </div>
      <button
        type="submit"
        className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition"
      >
        Save Changes
      </button>
    </form>
  )
}
