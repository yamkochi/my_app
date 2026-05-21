import { pool } from "@/lib/db"

async function getVipEmployees() {
  try {
    const query = `
      SELECT 
        employee.id,
        employee.name, 
        employee.email, 
        employee.photo_url, 
        role.role_name 
      FROM employee
      INNER JOIN role ON employee.role_id = role.id
      WHERE employee.vip = 1;
    `

    // Execute query using the connection pool
    const [rows] = await pool.query(query)
    return rows
  } catch (error) {
    console.error("Database query failed:", error)
    return []
  }
}

export default async function TeamPage() {
  const vipEmployees = await getVipEmployees()

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            Our VIP Team
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-400">
            We’re a dynamic group of individuals who are passionate about what
            we do and dedicated to delivering the best results for our clients.
          </p>
        </div>

        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {vipEmployees.map((employee) => (
            <li key={employee.id}>
              {/* 1. Photo (Top) */}
              <img
                src={employee.photo_url || "/placeholder-avatar.jpg"}
                alt={employee.name}
                className="aspect-3/2 w-full rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
              />

              {/* 2. Name (Below Photo) */}
              <h3 className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900 dark:text-white">
                {employee.name}
              </h3>

              {/* 3. Role Name (Below Name) */}
              <p className="text-base/7 text-indigo-600 dark:text-indigo-400 font-medium">
                {employee.role_name}
              </p>

              {/* 4. Email (Below Role) */}
              <p className="text-sm/6 text-gray-500 dark:text-gray-400 break-all mt-1">
                {employee.email}
              </p>
            </li>
          ))}
        </ul>

        {vipEmployees.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No VIP members found.
          </p>
        )}
      </div>
    </div>
  )
}
