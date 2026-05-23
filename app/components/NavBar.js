// components/Navbar.js
"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Navbar({ initialUser }) {
  const router = useRouter()
  const [user, setUser] = useState(initialUser)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // State trackers for multi-step password reset phases
  const [isForgotMode, setIsForgotMode] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1: Request Pin, 2: Enter Pin & Complete Reset
  const [verificationCode, setVerificationCode] = useState("")
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
      label: "People & Bridges",
      href: "/dashboard",
      special: false,
      subItems: [
        { label: "Core Team", href: "/team" },
        { label: "Employee list", href: "/admin/roles" },
        { label: "Bridge Location ", href: "/map" },
        { label: "Employee Location Map", href: "/admin/employee-map" },
      ],
    },
    {
      label: "Manage Employees",
      href: "/admin",
      special: true,
      subItems: [{ label: "Manage Employee", href: "/employee" }],
    },
    {
      label: "Manage Projects",
      href: "/admin",
      special: true,
      subItems: [
        { label: "Manage Projects", href: "/projects" },
        { label: "Manage Location Icons", href: "/projects/iconmgr" },
      ],
    },
    {
      label: "System Health",
      href: "/health",
      special: true,
      subItems: [{ label: "Check", href: "/health" }],
    },
    {
      label: "Your Profile",
      href: "/profile",
      special: false,
      subItems: [{ label: "Your Profile", href: "/dashboard/profile" }],
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

  // Phase 1: Request 4-Digit Code
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
      setForgotStep(2) // Move to pin input display
    } else {
      setError(data.error || "Failed to request reset verification.")
    }
  }

  // Phase 2: Verify Pin Code & Complete Reset Action
  const handleVerifyAndResetSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMsg("")

    const response = await fetch("/api/auth/verify-and-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: verificationCode }),
    })

    const data = await response.json()
    if (response.ok) {
      setSuccessMsg(data.message)
      setIsForgotMode(false)
      setForgotStep(1)
      setVerificationCode("")
      setEmail("")
      setPassword("")
    } else {
      setError(data.error || "Invalid or expired verification code.")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setOpenDropdown(-1)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout navigation failed:", error)
    }
  }

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? -1 : index)
  }

  const closeAuthModal = () => {
    setIsModalOpen(false)
    setIsForgotMode(false)
    setForgotStep(1)
    setError("")
    setSuccessMsg("")
    setEmail("")
    setPassword("")
    setVerificationCode("")
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

        <div className="flex items-center space-x-6 bg-amber-50 px-2 py-1 rounded-xl border border-gray-700 transition align-middle">
          {user ? (
            <>
              <span className="text-xl font-extrabold text-blue-800 ">
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
                <span className="text-xl font-semibold text-white">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-xl font-semibold px-6 py-2.5 rounded-xl transition text-white"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* AUTHENTICATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-gray-800 relative border border-gray-100">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold p-2"
            >
              &times;
            </button>

            {/* Notification Elements */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-4 border border-red-100">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm font-medium mb-4 border border-emerald-100">
                {successMsg}
              </div>
            )}

            {/* SCREEN 1: User Login Input Dashboard */}
            {!isForgotMode && (
              <form onSubmit={handleLogin} className="space-y-5">
                <h3 className="text-2xl font-bold text-gray-900">
                  Account Login
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    placeholder="••••••••"
                  />
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true)
                      setForgotStep(1)
                      setError("")
                      setSuccessMsg("")
                    }}
                    className="text-indigo-600 hover:underline font-medium text-sm"
                  >
                    Forgot Password?
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition text-lg shadow-lg shadow-indigo-600/20"
                >
                  Sign In
                </button>
              </form>
            )}

            {/* SCREEN 2: Forgot Password Recovery - Step 1 (Request Token) */}
            {isForgotMode && forgotStep === 1 && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                <h3 className="text-2xl font-bold text-gray-900">
                  Reset Password
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Enter your verified registration email to claim an
                  authorization pin code.
                </p>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    placeholder="name@company.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition text-lg shadow-lg"
                >
                  Send 4-Digit Pin
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false)
                      setError("")
                      setSuccessMsg("")
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* SCREEN 3: Forgot Password Recovery - Step 2 (Verify Pin Box) */}
            {isForgotMode && forgotStep === 2 && (
              <form onSubmit={handleVerifyAndResetSubmit} className="space-y-5">
                <h3 className="text-2xl font-bold text-gray-900">
                  Confirm Identity
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Provide the 4-digit token dispatched to{" "}
                  <strong className="text-gray-700">{email}</strong> to complete
                  verification.
                </p>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 text-center">
                    4-Digit Security Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-36 mx-auto tracking-[0.7em] text-center font-mono font-bold text-2xl px-2 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 block"
                    placeholder="0000"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition text-lg shadow-lg shadow-emerald-600/20"
                >
                  Verify Pin & Reset
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1)
                      setError("")
                      setSuccessMsg("")
                      setVerificationCode("")
                    }}
                    className="text-indigo-600 hover:underline text-sm font-medium transition"
                  >
                    Change Email Input
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
