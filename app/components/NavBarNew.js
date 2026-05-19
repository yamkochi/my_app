"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

// Dynamic Multi-Dropdown Configuration
const navigationLinks = [
  {
    name: "Dashboard",
    items: [
      { name: "Test Connection", href: "/emp" },

      { name: "Reports", href: "#" },
    ],
  },
  {
    name: "Maange Team",
    items: [
      { name: "Manage Members", href: "/employee" },
      { name: "Manage Roles", href: "/roles" },
      { name: "Activity Log", href: "#" },
    ],
  },
  {
    name: "View Team",
    items: [
      { name: "View", href: "/team" },
      { name: "Assign Admin Role", href: "" },
      { name: "Activity Log", href: "#" },
    ],
  },
  {
    name: "Projects",
    items: [
      { name: "Manage Projects", href: "/projects" },
      { name: "Completed", href: "#" },
      { name: "Archived", href: "#" },
    ],
  },
  {
    name: "Projects On Map",
    items: [
      { name: "View map", href: "/map" },
      { name: "Manage icons", href: "/projects/iconmgr" },
      { name: "Archived", href: "#" },
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
                src="https://tailwindcss.com"
                alt="Your Company"
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
          <div className="flex items-center">
            <div className="shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:shadow-none"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="-ml-0.5 size-5"
                >
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                New Job
              </button>
            </div>
            <div className="hidden md:ml-4 md:flex md:shrink-0 md:items-center">
              <button
                type="button"
                className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 dark:text-gray-400"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className="size-6"
                >
                  <path
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen)
                    setActiveDropdown(null)
                  }}
                  className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  aria-expanded={isProfileOpen}
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img
                    src={userDetails.imageUrl}
                    alt=""
                    className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                  />
                </button>

                <div
                  className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline-1 outline-black/5 transition-all duration-200 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 ${isProfileOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
                >
                  {profileLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/5"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {navigationLinks.map((dropdown, index) => (
            <div key={dropdown.name} className="block">
              <button
                onClick={() => toggleMobileSubmenu(index)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                <span>{dropdown.name}</span>
                <svg
                  className={`size-4 transform transition-transform duration-200 ${mobileSubmenus[index] ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Mobile Submenu Expansion */}
              <div
                className={`pl-4 space-y-1 transition-all overflow-hidden ${mobileSubmenus[index] ? "max-h-40 py-1" : "max-h-0"}`}
              >
                {dropdown.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-4 pb-3">
          <div className="flex items-center px-5 sm:px-6">
            <div className="shrink-0">
              <img
                src={userDetails.imageUrl}
                alt=""
                className="size-10 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">
                {userDetails.name}
              </div>
              <div className="text-sm font-medium text-gray-400">
                {userDetails.email}
              </div>
            </div>
            <button
              type="button"
              className="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">View notifications</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className="size-6"
              >
                <path
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="mt-3 space-y-1 px-2 sm:px-3">
            {profileLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
