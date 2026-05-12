import Form from "next/form"
import { createuser } from "../actions/employees"
export default async function Page() {
  // async function createuser(formdata) {
  //   "use server"
  //   const name = formdata.get("name")
  //   console.log(name)
  //   const res = await fetch("http://localhost:3000/api/empdata", {
  //     method: "POST",
  //     // body: name,
  //     body: JSON.stringify({ name }),
  //   })
  //   // console.log(res.json())
  // }

  return (
    <Form action={createuser} className="flex gap-2">
      <input
        name="name"
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
        placeholder="Search products"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </Form>
  )
}
