"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

// Dynamic Multi-Dropdown Configuration
const navigationLinks = [
  {
    name: "Testing DB Conectionn",
    items: [{ name: "Test Connection", href: "/emp" }],
  },
  {
    name: "Maange Team",
    items: [
      { name: "Manage Members", href: "/employee" },
      { name: "Manage Roles", href: "/roles" },
    ],
  },
  {
    name: "View Team",
    items: [{ name: "View", href: "/team" }],
  },
  {
    name: "Projects",
    items: [{ name: "Manage Projects", href: "/projects" }],
  },
  {
    name: "Projects On Map",
    items: [
      { name: "View map", href: "/map" },
      { name: "Manage icons", href: "/projects/iconmgr" },
    ],
  },
  {
    name: "Calendar",
    items: [
      { name: "Schedule", href: "#" },
      { name: "Events", href: "#" },
    ],
  },
]

const profileLinks = [
  { name: "Your profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
]

const userDetails = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl: "https://unsplash.com",
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Tracks index of the active main menu dropdown, null if none open
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Track open states for mobile submenus independently
  const [mobileSubmenus, setMobileSubmenus] = useState({})

  const navRef = useRef(null)

  // Global click detector to close everything when clicking away
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null)
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
    setIsProfileOpen(false)
  }

  const toggleMobileSubmenu = (index) => {
    setMobileSubmenus((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <nav
      ref={navRef}
      className="relative bg-gray-800 dark:bg-gray-800/50 dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="mr-2 -ml-2 flex items-center md:hidden">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className={`size-6 ${isMobileMenuOpen ? "hidden" : "block"}`}
                >
                  <path
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className={`size-6 ${isMobileMenuOpen ? "block" : "hidden"}`}
                >
                  <path
                    d="M6 18 18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex shrink-0 items-center">
              <img
                src="/misc/handl.png"
                alt="Heath-Linback"
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Navigation Dropdowns */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {navigationLinks.map((dropdown, index) => (
                <div key={dropdown.name} className="relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium transition duration-150 ease-in-out ${
                      activeDropdown === index
                        ? "bg-gray-900 text-white dark:bg-gray-950/50"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                    aria-expanded={activeDropdown === index}
                  >
                    <span>{dropdown.name}</span>
                    <svg
                      className={`size-4 transition-transform duration-200 ${activeDropdown === index ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  <div
                    className={`absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg outline-1 outline-black/5 transition-all duration-200 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 ${
                      activeDropdown === index
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    {dropdown.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/5"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Replaced Button Section */}
          <div className="flex items-center">
            <div className="shrink-0">
              <Link
                href="/login"
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:shadow-none transition duration-150 ease-in-out"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="-ml-0.5 size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-   .5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                    clipRule="evenodd"
                  />
                </svg>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
