// components/Navbar.js
"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export default function Navbar({ initialUser }) {
  const [user, setUser] = useState(initialUser)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // NEW state trackers for handling forgot password transitions
  const [isForgotMode, setIsForgotMode] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const [openDropdown, setOpenDropdown] = useState(-1)
  const navbarRef = useRef(null)

  const navItems = [
    {
      label: "Home",
      href: "/",
      special: false,
      subItems: [
        { label: "Overview", href: "/overview" },
        { label: "Features", href: "/features" },
      ],
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      special: false,
      subItems: [
        { label: "My Profile", href: "/dashboard/profile" },
        { label: "Core Team", href: "/team" },
        { label: "User Roles", href: "/admin/roles" },
        { label: "Project Location ", href: "/map" },
      ],
    },
    {
      label: "Admin Panel",
      href: "/admin",
      special: true,
      subItems: [
        { label: "Manage Employee", href: "/employee" },
        { label: "Manage Projects", href: "/projects" },
        { label: "Manage Location Icons", href: "/projects/iconmgr" },
      ],
    },
  ]

  useEffect(() => {
    if (initialUser) setUser(initialUser)
  }, [initialUser])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("unauthorized") === "true") setIsModalOpen(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target))
        setOpenDropdown(-1)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (response.ok) {
      setUser(data.user)
      setIsModalOpen(false)
      setEmail("")
      setPassword("")
    } else {
      setError(data.error || "Login failed")
    }
  }

  // NEW function handler to dispatch password reset request API actions
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMsg("")

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()
    if (response.ok) {
      setSuccessMsg(data.message)
      setEmail("")
    } else {
      setError(data.error || "Failed to request reset verification.")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    setOpenDropdown(-1)
  }

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? -1 : index)
  }

  const closeAuthModal = () => {
    setIsModalOpen(false)
    setIsForgotMode(false)
    setError("")
    setSuccessMsg("")
    setEmail("")
    setPassword("")
  }

  return (
    <>
      <nav
        ref={navbarRef}
        className="bg-gray-900 text-white px-8 py-5 flex items-center justify-between shadow-md relative z-40"
      >
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="font-bold text-2xl tracking-wider text-indigo-400"
          >
            EnterpriseApp
          </Link>
          <div className="flex space-x-4">
            {navItems.map((item, index) => {
              if (item.special && !user?.isAdmin) return null
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="hover:bg-gray-800 text-xl font-medium px-4 py-2.5 rounded-md flex items-center space-x-2 transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.special && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded ml-2">
                        Admin
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${openDropdown === index ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openDropdown === index && (
                    <div className="absolute left-0 mt-3 w-64 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 text-gray-800 z-50">
                      {item.subItems.map((subItem, sIdx) => (
                        <Link
                          key={sIdx}
                          href={subItem.href}
                          onClick={() => setOpenDropdown(-1)}
                          className="block px-5 py-3 text-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-xl font-medium text-gray-300">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-4 bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-xl border border-gray-700 transition align-middle"
              >
                <img
                  src={user.photo_url || "https://unsplash.com"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
                />
                <span className="text-xl font-semibold">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-xl font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Interactive Modal Overlay Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-gray-900 w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {isForgotMode ? "Reset Credentials" : "Employee Login"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 text-base rounded-lg font-medium">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 text-base rounded-lg font-medium">
                ✅ {successMsg}
              </div>
            )}

            {/* DYNAMIC FORMS ACCORDING TO VIEW MODE */}
            {isForgotMode ? (
              /* FORGOT PASSWORD FORM LAYOUT VIEW */
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base bg-gray-50 outline-none"
                    placeholder="name@company.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition text-base shadow-md mt-2"
                >
                  Send Temporary Password
                </button>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false)
                      setError("")
                      setSuccessMsg("")
                    }}
                    className="text-indigo-600 hover:underline text-sm font-semibold"
                  >
                    &larr; Back to Login form window
                  </button>
                </div>
              </form>
            ) : (
              /* STANDARD LOGIN FORM LAYOUT VIEW */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base bg-gray-50 outline-none"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Password
                    </label>
                    {/* ADDED: Interactive Forgot Password button toggle element */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true)
                        setError("")
                        setSuccessMsg("")
                      }}
                      className="text-indigo-600 hover:underline text-xs font-bold tracking-wide"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base bg-gray-50 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition text-base shadow-md mt-2"
                >
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
