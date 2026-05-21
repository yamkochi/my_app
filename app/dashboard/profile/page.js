// app/dashboard/profile/page.js
import { getSession } from "@/app/api/auth/session"
import { pool } from "@/lib/db"
import { redirect } from "next/navigation"
// ✅ FIXED: Corrected import to pull the Form component instead of the Map component modal
import ProfileForm from "./ProfileForm.js"

export default async function EmployeeProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/?unauthorized=true")
  }

  let employee = null
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, photo_url, admin, lat, lan FROM employee WHERE id = ? LIMIT 1",
      [session.id],
    )
    if (rows.length > 0) {
      employee = rows[0]
    }
  } catch (error) {
    console.error("Database fetch failure:", error)
  }

  const userData = employee || session

  const isAdminRole = Buffer.isBuffer(userData.admin)
    ? userData.admin.readInt8(0) === 1
    : !!userData.admin

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl mt-12 overflow-hidden border border-gray-100">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 h-40 relative">
          <div className="absolute -bottom-16 left-8">
            <img
              src={userData.photo_url || "https://unsplash.com"}
              alt="Profile"
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-gray-200"
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Edit Profile
              </h1>
              <p className="text-xl text-gray-500 mt-1">
                Account reference code: #{userData.id}
              </p>
            </div>
            <div>
              {isAdminRole ? (
                <span className="text-sm font-bold uppercase tracking-wider bg-red-100 text-red-700 px-4 py-2 rounded-full border border-red-200">
                  🛡️ Administrator
                </span>
              ) : (
                <span className="text-sm font-bold uppercase tracking-wider bg-green-100 text-green-700 px-4 py-2 rounded-full border border-green-200">
                  💼 Staff Member
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Registered Corporate Email (Unchangeable)
            </label>
            <div className="text-xl font-medium text-gray-400 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 select-none cursor-not-allowed">
              {userData.email}
            </div>
          </div>

          {/* This now renders the actual interactive inputs and your Map-your-location button */}
          <ProfileForm initialData={userData} />
        </div>
      </div>
    </main>
  )
}
