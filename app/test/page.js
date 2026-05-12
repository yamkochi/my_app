"use client"
const res = await fetch("http://localhost:3000/api/empdata", {
  method: "POST",
  body: JSON.stringify({ name: "John Doe" }),
})
const data = await res.json()

const res1 = await fetch("http://localhost:3000/api/test", {
  method: "GET",
})
const data1 = await res1.json()

// This is the Home component, which serves as the home directory
export default function test() {
  //const mydata = data
  return (
    <main>
      <div className="flex flex-row h-28 w-2xl m-7">
        <div className="bg-red-300 h-48 w-48">
          <ul>
            <li>{data.message}</li>
            <li>{data.data}</li>
            <li>{data.id}</li>
          </ul>
        </div>

        <div className="bg-green-300 h-48 w-48">
          <a>{data1.message}</a>
        </div>
      </div>
    </main>
  )
}
